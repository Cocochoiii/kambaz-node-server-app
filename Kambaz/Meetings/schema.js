import mongoose from "mongoose";

// One course has many Zoom meetings.
// host keeps the _id of the user who runs the meeting.
const schema = new mongoose.Schema(
    {
        _id: String,
        course: { type: String, ref: "CourseModel" },
        topic: String,
        startTime: String,
        duration: Number,
        meetingId: String,
        host: { type: String, ref: "UserModel" },
        past: Boolean,
    },
    { collection: "meetings" }
);
export default schema;
