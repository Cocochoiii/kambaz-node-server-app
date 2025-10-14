// Kambaz/Pazza/init.js
import mongoose from "mongoose";
import { pazzaSeedData } from "../Database/pazza.js";
import { Folder, Post } from "./models.js";

export async function initializePazzaData() {
    try {
        // Don't use initTracker - check actual data instead
        const existingFolders = await Folder.countDocuments();
        const existingPosts = await Post.countDocuments();

        console.log(`📊 Pazza data check: ${existingFolders} folders, ${existingPosts} posts`);

        // Initialize folders if none exist
        if (existingFolders === 0 && pazzaSeedData?.folders) {
            console.log('Inserting Pazza folders...');
            await Folder.insertMany(pazzaSeedData.folders);
            console.log(`✅ Inserted ${pazzaSeedData.folders.length} folders`);
        }

        // Initialize posts if none exist
        if (existingPosts === 0 && pazzaSeedData?.posts) {
            console.log('Inserting Pazza posts...');

            const processedPosts = pazzaSeedData.posts.map(post => {
                const postCopy = { ...post };

                // Process answers
                const postAnswers = pazzaSeedData.answers?.filter(a => a.postId === post._id) || [];
                postCopy.studentAnswers = postAnswers
                    .filter(a => a.authorRole === 'STUDENT')
                    .map(a => ({
                        _id: a._id,
                        author: a.author,
                        authorRole: a.authorRole,
                        authorName: a.authorName,
                        content: a.content,
                        timestamp: new Date(a.createdAt),
                        isGoodAnswer: a.isGoodAnswer || false
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
                        isGoodAnswer: a.isGoodAnswer || false
                    }));

                // Process followups
                const postFollowups = (pazzaSeedData.followups || [])
                    .filter(f => f.postId === post._id && !f.parentId)
                    .map(f => {
                        const replies = (pazzaSeedData.followups || [])
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
                            isResolved: f.isResolved || false,
                            timestamp: new Date(f.createdAt),
                            replies
                        };
                    });

                postCopy.followups = postFollowups;
                postCopy.hasInstructorAnswer = postCopy.instructorAnswers.length > 0;
                postCopy.hasStudentAnswer = postCopy.studentAnswers.length > 0;

                // Ensure dates are Date objects
                postCopy.createdAt = new Date(postCopy.createdAt);
                postCopy.updatedAt = new Date(postCopy.updatedAt);

                return postCopy;
            });

            await Post.insertMany(processedPosts);
            console.log(`✅ Inserted ${processedPosts.length} posts`);
        }

        console.log("✅ Pazza initialization check complete");
        return true;

    } catch (error) {
        console.error('❌ Error initializing Pazza data:', error);
        return false;
    }
}