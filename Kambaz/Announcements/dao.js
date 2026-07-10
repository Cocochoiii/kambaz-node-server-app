import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export const findAnnouncementsForCourse = (courseId) => model.find({ course: courseId });

export const createAnnouncement = (announcement) => {
    const newAnnouncement = {
        date: new Date().toISOString(),
        ...announcement,
        _id: announcement._id || uuidv4(),
    };
    return model.create(newAnnouncement);
};

export const updateAnnouncement = async (announcementId, updates) => {
    const { _id, ...rest } = updates;
    await model.updateOne({ _id: announcementId }, { $set: rest });
    return model.findById(announcementId);
};

export const deleteAnnouncement = (announcementId) =>
    model.deleteOne({ _id: announcementId });
