import mongoose from "mongoose";

const zoomMeetingSchema = new mongoose.Schema(
    {
        _id: String,
        topic: String,
        courseId: { type: String, ref: "CourseModel" },
        courseName: String,
        section: String,
        meetingId: String,          // Zoom-like number "123-4567-8901"
        passcode: String,
        startTime: Date,
        duration: Number,
        timezone: String,
        joinUrl: String,
        status: { type: String, enum: ["upcoming", "past", "recurring"], default: "upcoming" },
        hostId: { type: String, ref: "UserModel" },
        recordingUrl: String,
        createdAt: { type: Date, default: Date.now },
    },
    { collection: "zoom_meetings" }
);

const personalRoomSchema = new mongoose.Schema(
    {
        _id: String,           // `${userId}-pmr`
        userId: { type: String, ref: "UserModel", unique: true },
        meetingId: String,
        passcode: String,
        joinUrl: String,
        createdAt: { type: Date, default: Date.now },
    },
    { collection: "zoom_personal_rooms" }
);

const recordingSchema = new mongoose.Schema(
    {
        _id: String,
        meetingId: String,
        topic: String,
        courseId: { type: String, ref: "CourseModel" },
        date: String,          // keep as string to match your reducer/table
        duration: String,
        url: String,
        ownerId: { type: String, ref: "UserModel" },
        createdAt: { type: Date, default: Date.now },
    },
    { collection: "zoom_recordings" }
);

export const ZoomMeetingSchema = zoomMeetingSchema;
export const PersonalRoomSchema = personalRoomSchema;
export const RecordingSchema = recordingSchema;
