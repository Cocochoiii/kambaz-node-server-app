import * as dao from "./dao.js";

export default function MessageRoutes(app) {
    // My inbox. "current" means the user in the session.
    const findMessagesForUser = async (req, res) => {
        let { userId } = req.params;
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }
        const messages = await dao.findMessagesForUser(userId);
        res.json(messages);
    };

    // Send one. The sender is always the user in the session.
    const createMessage = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const message = { ...req.body, from: currentUser._id };
        const created = await dao.createMessage(message);
        res.json(created);
    };

    // Reading a message marks it as read.
    const updateMessage = async (req, res) => {
        const { messageId } = req.params;
        const updated = await dao.updateMessage(messageId, req.body);
        if (!updated) {
            res.status(404).json({ message: `Unable to update message ${messageId}` });
            return;
        }
        res.json(updated);
    };

    const deleteMessage = async (req, res) => {
        await dao.deleteMessage(req.params.messageId);
        res.sendStatus(200);
    };

    app.get("/api/users/:userId/messages", findMessagesForUser);
    app.post("/api/messages", createMessage);
    app.put("/api/messages/:messageId", updateMessage);
    app.delete("/api/messages/:messageId", deleteMessage);
}
