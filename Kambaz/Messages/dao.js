import model from "./model.js";
import userModel from "../Users/model.js";
import courseModel from "../Courses/model.js";
import { v4 as uuidv4 } from "uuid";

// The Inbox shows what other people sent to me.
// I add the sender name and the course name, so the screen can print them.
// I list the fields by hand, so the answer stays a plain object.
function withNames(message, sender, course) {
    return {
        _id: message._id,
        from: sender ? sender._id : message.from,
        to: message.to,
        course: course ? course._id : message.course,
        subject: message.subject,
        body: message.body,
        date: message.date,
        read: message.read,
        fromName: sender ? `${sender.firstName} ${sender.lastName}` : "Unknown",
        courseName: course ? course.name : "",
    };
}

// populate changes a key into the real document.
export async function findMessagesForUser(userId) {
    const messages = await model
        .find({ to: userId })
        .populate("from")
        .populate("course");
    const named = messages.map((message) =>
        withNames(message, message.from, message.course)
    );
    // Newest first.
    named.sort((a, b) => (a.date < b.date ? 1 : -1));
    return named;
}

export async function createMessage(message) {
    const newMessage = {
        date: new Date().toISOString(),
        read: false,
        ...message,
        _id: uuidv4(),
    };
    const created = await model.create(newMessage);
    const sender = await userModel.findById(created.from);
    const course = created.course ? await courseModel.findById(created.course) : null;
    return withNames(created, sender, course);
}

// I drop _id and __v first. Mongo does not let me change them.
export async function updateMessage(messageId, updates) {
    const { _id, __v, ...rest } = updates;
    await model.updateOne({ _id: messageId }, { $set: rest });
    // A wrong id used to crash the server. Now the route answers 404.
    return model.findById(messageId);
}

export function deleteMessage(messageId) {
    return model.deleteOne({ _id: messageId });
}
