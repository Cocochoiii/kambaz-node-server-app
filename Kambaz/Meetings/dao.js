import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function findMeetingsForCourse(courseId) {
    return Database.meetings.filter((m) => m.course === courseId);
}
export function createMeeting(meeting) {
    const newMeeting = { ...meeting, _id: uuidv4() };
    Database.meetings = [...Database.meetings, newMeeting];
    return newMeeting;
}
export function deleteMeeting(meetingId) {
    Database.meetings = Database.meetings.filter((m) => m._id !== meetingId);
    return true;
}
