// Kambaz/Database/initTracker.js
import mongoose from "mongoose";

const initSchema = new mongoose.Schema({
                                           _id: { type: String, required: true },
                                           initialized: { type: Boolean, default: false },
                                           lastInit: { type: Date, default: Date.now },
                                           version: { type: String, default: "1.0" }
                                       });

export const InitTracker = mongoose.models.InitTracker || mongoose.model("InitTracker", initSchema);

export async function isInitialized(module) {
    try {
        const tracker = await InitTracker.findById(module);
        return tracker?.initialized === true;
    } catch (error) {
        console.error(`Error checking initialization for ${module}:`, error);
        return false;
    }
}

export async function markInitialized(module) {
    try {
        await InitTracker.findByIdAndUpdate(
            module,
            {
                _id: module,
                initialized: true,
                lastInit: new Date(),
                version: "1.0"
            },
            { upsert: true, new: true }
        );
        console.log(`✅ Marked ${module} as initialized`);
    } catch (error) {
        console.error(`Error marking ${module} as initialized:`, error);
    }
}