import mongoose from 'mongoose';
import { pazzaSeedData } from './Kambaz/Database/pazza.js';

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/kambaz')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB error:', err));

// Define schemas
const folderSchema = new mongoose.Schema({
                                             _id: String,
                                             name: String,
                                             course: String,
                                             isDefault: Boolean,
                                             order: Number
                                         });

const postSchema = new mongoose.Schema({
                                           _id: String,
                                           course: String,
                                           type: String,
                                           postTo: String,
                                           visibleTo: [String],
                                           folders: [String],
                                           summary: String,
                                           details: String,
                                           author: String,
                                           authorRole: String,
                                           authorName: String,
                                           createdAt: Date,
                                           updatedAt: Date,
                                           views: Number,
                                           hasInstructorAnswer: Boolean,
                                           hasStudentAnswer: Boolean,
                                           isPinned: Boolean,
                                           isInstructorEndorsed: Boolean
                                       });

const Folder = mongoose.model('PazzaFolder', folderSchema);
const Post = mongoose.model('PazzaPost', postSchema);

async function initializeData() {
    try {
        // Clear existing data
        await Folder.deleteMany({});
        await Post.deleteMany({});
        console.log('Cleared existing data');

        // Insert folders
        await Folder.insertMany(pazzaSeedData.folders);
        console.log(`Inserted ${pazzaSeedData.folders.length} folders`);

        // Insert posts
        await Post.insertMany(pazzaSeedData.posts);
        console.log(`Inserted ${pazzaSeedData.posts.length} posts`);

        // Verify
        const folderCount = await Folder.countDocuments();
        const postCount = await Post.countDocuments();
        console.log(`Verification: ${folderCount} folders, ${postCount} posts in database`);

        // Show sample data
        const samplePosts = await Post.find({ course: "5610" }).limit(3);
        console.log('Sample posts for course 5610:', samplePosts.map(p => p.summary));

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

initializeData();