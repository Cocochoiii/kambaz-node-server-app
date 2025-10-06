import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

/** List by course (newest first, pinned first) */
export const listForCourse = (courseId) =>
    model
        .find({ course: courseId })
        .sort({ pinned: -1, date: -1 })
        .lean();

/** Create for course; author info comes from the session user */
export const createForCourse = async (courseId, payload, user) => {
    const doc = await model.create({
                                       _id: uuidv4(),
                                       course: courseId,
                                       title: payload.title,
                                       content: payload.content || "",
                                       section: payload.section || "All Sections",
                                       pinned: !!payload.pinned,
                                       authorId: user?._id,
                                       author: user?.username || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Unknown",
                                       date: new Date(),
                                   });
    return doc.toObject();
};

/** Update limited fields; keep original posted `date` */
export const updateAnnouncement = async (id, updates) => {
    const allowed = {};
    if (typeof updates.title === "string") allowed.title = updates.title;
    if (typeof updates.content === "string") allowed.content = updates.content;
    if (typeof updates.section === "string") allowed.section = updates.section;
    if (typeof updates.pinned === "boolean") allowed.pinned = updates.pinned;

    allowed.updatedAt = new Date();

    await model.updateOne({ _id: id }, { $set: allowed });
    const updated = await model.findById(id);
    return updated ? updated.toObject() : null;
};

export const deleteAnnouncement = (id) => model.deleteOne({ _id: id });
