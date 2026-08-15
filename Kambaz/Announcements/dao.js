import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function findAnnouncementsForCourse(courseId) {
    return Database.announcements.filter((a) => a.course === courseId);
}
export function createAnnouncement(announcement) {
    const newAnnouncement = { date: new Date().toISOString(), ...announcement, _id: uuidv4() };
    Database.announcements = [...Database.announcements, newAnnouncement];
    return newAnnouncement;
}
export function updateAnnouncement(announcementId, updates) {
    const a = Database.announcements.find((a) => a._id === announcementId);
    if (!a) return null;
    Object.assign(a, updates);
    return a;
}

export function deleteAnnouncement(announcementId) {
    Database.announcements = Database.announcements.filter((a) => a._id !== announcementId);
    return true;
}
