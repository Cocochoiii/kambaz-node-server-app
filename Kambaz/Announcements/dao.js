import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

// The announcement CRUD, written with the mongoose model.

export function findAnnouncementsForCourse(courseId) {
    return model.find({ course: courseId });
}

export function findAnnouncementById(announcementId) {
    return model.findById(announcementId);
}

export function createAnnouncement(announcement) {
    const newAnnouncement = {
        date: new Date().toISOString(),
        read: false,
        ...announcement,
        _id: uuidv4(),
    };
    return model.create(newAnnouncement);
}

// I drop _id and __v first. Mongo does not let me change them.
export function updateAnnouncement(announcementId, updates) {
    const { _id, __v, ...rest } = updates;
    return model.updateOne({ _id: announcementId }, { $set: rest });
}

export function deleteAnnouncement(announcementId) {
    return model.deleteOne({ _id: announcementId });
}

// When a course is deleted, its announcements are deleted too.
export function deleteAnnouncementsForCourse(courseId) {
    return model.deleteMany({ course: courseId });
}
