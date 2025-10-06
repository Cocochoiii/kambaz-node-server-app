import { v4 as uuidv4 } from "uuid";
import { ZoomMeetingModel, PersonalRoomModel, RecordingModel } from "./model.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

// ---------- Meetings ----------
export async function createMeeting(hostId, payload) {
    const _id = uuidv4();
    const meetingId =
        payload.meetingId ||
        `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`;
    const joinUrl = payload.joinUrl || `https://zoom.us/j/${meetingId.replace(/-/g, "")}`;

    const doc = {
        _id,
        topic: payload.topic,
        courseId: payload.courseId,
        courseName: payload.courseName || "",
        section: payload.section || "01",
        meetingId,
        passcode: payload.passcode || Math.random().toString(36).substring(7),
        startTime: new Date(payload.startTime),
        duration: Number(payload.duration || 60),
        timezone: payload.timezone || "America/New_York",
        joinUrl,
        status: payload.status || "upcoming",
        hostId,
        recordingUrl: payload.recordingUrl || "",
        createdAt: new Date(),
    };

    return ZoomMeetingModel.create(doc);
}

export function deleteMeeting(meetingId) {
    return ZoomMeetingModel.deleteOne({ _id: meetingId });
}

export function updateMeetingStatus(meetingId, status) {
    return ZoomMeetingModel.updateOne({ _id: meetingId }, { $set: { status } });
}

export function listMeetingsForCourse(courseId) {
    return ZoomMeetingModel.find({ courseId }).sort({ startTime: 1 });
}

// myOnly=true -> meetings visible to this user
export async function listMeetingsForUser(user, myOnly = true) {
    if (!user) return [];
    // faculty: show meetings you host
    if (user.role === "FACULTY") {
        return ZoomMeetingModel.find({ hostId: user._id }).sort({ startTime: 1 });
    }
    // students: meetings for enrolled courses
    const courses = await enrollmentsDao.findCoursesForUser(user._id);
    const courseIds = courses.map((c) => c._id);
    if (courseIds.length === 0) return [];
    return ZoomMeetingModel.find({ courseId: { $in: courseIds } }).sort({ startTime: 1 });
}

// Auto-mark past based on time (can be called before listing)
export async function sweepStatusesNow() {
    const now = new Date();
    const upcoming = await ZoomMeetingModel.find({ status: "upcoming" });
    const toPast = upcoming
        .filter((m) => new Date(m.startTime).getTime() + m.duration * 60000 < now.getTime())
        .map((m) => m._id);
    if (toPast.length) {
        await ZoomMeetingModel.updateMany({ _id: { $in: toPast } }, { $set: { status: "past" } });
    }
}

// ---------- Personal meeting room ----------
export async function getOrCreatePersonalRoom(userId) {
    if (!userId) return null;
    let pmr = await PersonalRoomModel.findOne({ userId });
    if (pmr) return pmr;

    const meetingId =
        `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`;
    pmr = await PersonalRoomModel.create({
                                             _id: `${userId}-pmr`,
                                             userId,
                                             meetingId,
                                             passcode: Math.random().toString(36).substring(7),
                                             joinUrl: `https://zoom.us/j/${meetingId.replace(/-/g, "")}`,
                                             createdAt: new Date(),
                                         });
    return pmr;
}

// ---------- Recordings ----------
export function listRecordings(courseId) {
    const q = courseId ? { courseId } : {};
    return RecordingModel.find(q).sort({ createdAt: -1 });
}

export function addRecording(ownerId, payload) {
    return RecordingModel.create({
                                     _id: uuidv4(),
                                     meetingId: payload.meetingId,
                                     topic: payload.topic,
                                     courseId: payload.courseId,
                                     date: payload.date,          // e.g., "Oct 5, 2025"
                                     duration: payload.duration,  // e.g., "1h 00m"
                                     url: payload.url,
                                     ownerId,
                                     createdAt: new Date(),
                                 });
}
