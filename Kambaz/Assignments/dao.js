import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export const listForCourse = (courseId) =>
    model.find({ course: courseId }).sort({ createdAt: -1 }).lean();

export const findById = (id) => model.findById(id).lean();

export const createForCourse = async (courseId, payload, user) => {
    const toDate = (v) => (v ? new Date(v) : undefined);

    const doc = await model.create({
                                       _id: uuidv4(),
                                       course: courseId,
                                       title: payload.title,
                                       description: payload.description ?? "",
                                       points: Number.isFinite(+payload.points) ? +payload.points : 100,
                                       dueDate: toDate(payload.dueDate),
                                       availableFrom: toDate(payload.availableFrom),
                                       availableUntil: toDate(payload.availableUntil),
                                       authorId: user?._id,
                                       author:
                                           user?.username ||
                                           `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
                                           "Unknown",
                                       createdAt: new Date(),
                                   });

    return doc.toObject();
};

export const updateAssignment = async (id, updates) => {
    const toDate = (v) => (v ? new Date(v) : undefined);
    const patch = {};

    if (typeof updates.title === "string") patch.title = updates.title;
    if (typeof updates.description === "string")
        patch.description = updates.description;
    if (updates.points !== undefined) patch.points = +updates.points || 0;

    if ("dueDate" in updates) patch.dueDate = toDate(updates.dueDate);
    if ("availableFrom" in updates)
        patch.availableFrom = toDate(updates.availableFrom);
    if ("availableUntil" in updates)
        patch.availableUntil = toDate(updates.availableUntil);

    patch.updatedAt = new Date();

    await model.updateOne({ _id: id }, { $set: patch });
    const updated = await model.findById(id);
    return updated ? updated.toObject() : null;
};

export const deleteAssignment = (id) => model.deleteOne({ _id: id });
