// seed-production.js
import mongoose from "mongoose";
import "dotenv/config";
import { initializePazzaData } from "./Kambaz/Pazza/init.js";
import { initializeQuizData } from "./Kambaz/Quizzes/init.js";

// Use your production MongoDB URI from environment variable
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/kambaz";

async function seedProduction() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to MongoDB");

        await initializePazzaData();
        console.log("✅ Pazza data seeded");

        await initializeQuizData();
        console.log("✅ Quiz data seeded");

        console.log("🎉 Production seeding completed!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

seedProduction();