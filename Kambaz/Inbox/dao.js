import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

/** Create message from current user */
export async function createMessage(sender, { subject, body, course, toText }) {
    const doc = {
        _id: uuidv4(),
        subject: subject?.trim() || "New message",
        body: body || "",
        preview: (body || "").trim().slice(0, 140),
        course: course || "",
        toText: toText || "",
        from: sender?._id || null,
        fromName: sender ? `${sender.firstName || ""} ${sender.lastName || ""}`.trim() || sender.username : "User",
        readBy: [], // sender is not auto-read for list symmetry, UI can mark if needed
        createdAt: new Date(),
    };
    const inserted = await model.create(doc);
    return inserted.toObject();
}

/** Find messages visible to the user (global + course-tagged). Supports q & course filter. */
export async function findMessagesForUser(userId, { q = "", course = "" } = {}) {
    const filter = {};
    if (course) filter.course = course;
    // basic text search if q is present
    const query = q
                  ? model.find({ $text: { $search: q }, ...filter })
                  : model.find(filter);
    const rows = await query.sort({ createdAt: -1 }).lean();
    // annotate unread
    return rows.map((m) => ({ ...m, unread: !m.readBy?.includes(userId) }));
}

/** Mark a message as read by user */
export async function markRead(userId, messageId) {
    return model.updateOne(
        { _id: messageId, readBy: { $ne: userId } },
        { $push: { readBy: userId } }
    );
}

/** Mark all as read for user */
export async function markAllRead(userId) {
    return model.updateMany(
        { readBy: { $ne: userId } },
        { $push: { readBy: userId } }
    );
}

/** Delete message (caller auth handled in route) */
export async function deleteMessage(messageId) {
    return model.deleteOne({ _id: messageId });
}

/** Helper to fetch single message */
export async function findById(messageId) {
    const row = await model.findById(messageId).lean();
    return row || null;
}
