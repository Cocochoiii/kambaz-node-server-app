import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

// The Zoom meeting CRUD, written with the mongoose model.

export function findMeetingsForCourse(courseId) {
    return model.find({ course: courseId });
}

export function createMeeting(meeting) {
    const newMeeting = { ...meeting, _id: uuidv4() };
    return model.create(newMeeting);
}

export function deleteMeeting(meetingId) {
    return model.deleteOne({ _id: meetingId });
}

// When a course is deleted, its meetings are deleted too.
export function deleteMeetingsForCourse(courseId) {
    return model.deleteMany({ course: courseId });
}
