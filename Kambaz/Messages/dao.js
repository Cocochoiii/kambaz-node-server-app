import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

// The Inbox shows what other people sent to me.
// I add the sender and the course, so the screen shows names.
function withNames(message) {
    const sender = Database.users.find((u) => u._id === message.from);
    const course = Database.courses.find((c) => c._id === message.course);
    return {
        ...message,
        fromName: sender ? `${sender.firstName} ${sender.lastName}` : "Unknown",
        courseName: course ? course.name : "",
    };
}

export function findMessagesForUser(userId) {
    return Database.messages
        .filter((m) => m.to === userId)
        .map(withNames)
        .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function createMessage(message) {
    const newMessage = {
        date: new Date().toISOString(),
        read: false,
        ...message,
        _id: uuidv4(),
    };
    Database.messages = [...Database.messages, newMessage];
    return withNames(newMessage);
}

export function updateMessage(messageId, updates) {
    const m = Database.messages.find((m) => m._id === messageId);
    if (!m) return null;
    Object.assign(m, updates);
    return withNames(m);
}

export function deleteMessage(messageId) {
    Database.messages = Database.messages.filter((m) => m._id !== messageId);
    return true;
}
