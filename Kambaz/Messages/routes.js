import * as dao from "./dao.js";

export default function MessageRoutes(app) {
    // My inbox. "current" means the user in the session.
    app.get("/api/users/:userId/messages", (req, res) => {
        let { userId } = req.params;
        if (userId === "current") {
            const currentUser = req.session.currentUser;
            if (!currentUser) return res.sendStatus(401);
            userId = currentUser._id;
        }
        res.json(dao.findMessagesForUser(userId));
    });

    // Send one. The sender is always the user in the session.
    app.post("/api/messages", (req, res) => {
        const currentUser = req.session.currentUser;
        if (!currentUser) return res.sendStatus(401);
        const message = { ...req.body, from: currentUser._id };
        res.json(dao.createMessage(message));
    });

    // Reading a message marks it as read.
    app.put("/api/messages/:messageId", (req, res) => {
        const updated = dao.updateMessage(req.params.messageId, req.body);
        if (!updated) {
            return res
                .status(404)
                .json({ message: `Unable to update message ${req.params.messageId}` });
        }
        res.json(updated);
    });

    app.delete("/api/messages/:messageId", (req, res) => {
        dao.deleteMessage(req.params.messageId);
        res.sendStatus(200);
    });
}
