// Kambaz/Pazza/init.js
import mongoose from "mongoose";
import { pazzaSeedData } from "../Database/pazza.js";

// Use the models from models.js to avoid duplication
import { Folder, Post } from "./models.js";

export async function initializePazzaData() {
    try {
        // Check if we already have data
        const existingFolders = await Folder.countDocuments();
        if (existingFolders === 0) {
            console.log('Inserting Pazza folders...');
            await Folder.insertMany(pazzaSeedData.folders);
            console.log(`✅ Inserted ${pazzaSeedData.folders.length} folders`);
        }

        const existingPosts = await Post.countDocuments();
        if (existingPosts === 0) {
            console.log('Inserting Pazza posts...');

            const processedPosts = pazzaSeedData.posts.map(post => {
                const postCopy = { ...post };

                const postAnswers = pazzaSeedData.answers.filter(a => a.postId === post._id);
                postCopy.studentAnswers = postAnswers
                    .filter(a => a.authorRole === 'STUDENT')
                    .map(a => ({
                        _id: a._id,
                        author: a.author,
                        authorRole: a.authorRole,
                        authorName: a.authorName,
                        content: a.content,
                        timestamp: new Date(a.createdAt),
                        isGoodAnswer: a.isGoodAnswer
                    }));

                postCopy.instructorAnswers = postAnswers
                    .filter(a => ['FACULTY', 'TA', 'INSTRUCTOR'].includes(a.authorRole))
                    .map(a => ({
                        _id: a._id,
                        author: a.author,
                        authorRole: a.authorRole,
                        authorName: a.authorName,
                        content: a.content,
                        timestamp: new Date(a.createdAt),
                        isGoodAnswer: a.isGoodAnswer
                    }));

                const postFollowups = pazzaSeedData.followups
                    .filter(f => f.postId === post._id && !f.parentId)
                    .map(f => {
                        const replies = pazzaSeedData.followups
                            .filter(r => r.parentId === f._id)
                            .map(r => ({
                                _id: r._id,
                                author: r.author,
                                authorRole: r.authorRole,
                                authorName: r.authorName,
                                content: r.content,
                                timestamp: new Date(r.createdAt)
                            }));

                        return {
                            _id: f._id,
                            author: f.author,
                            authorRole: f.authorRole,
                            authorName: f.authorName,
                            content: f.content,
                            isResolved: f.isResolved,
                            timestamp: new Date(f.createdAt),
                            replies
                        };
                    });

                postCopy.followups = postFollowups;
                postCopy.hasInstructorAnswer = postCopy.instructorAnswers.length > 0;
                postCopy.hasStudentAnswer = postCopy.studentAnswers.length > 0;

                return postCopy;
            });

            await Post.insertMany(processedPosts);
            console.log(`✅ Inserted ${processedPosts.length} posts with answers and followups`);
        }
    } catch (error) {
        console.error('Error initializing Pazza data:', error);
        // Don't throw - let the server continue
    }
}