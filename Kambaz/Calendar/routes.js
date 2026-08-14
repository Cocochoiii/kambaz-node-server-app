import * as dao from "./dao.js";

export default function CalendarRoutes(app) {
    // Everything on my calendar, in one request.
    app.get("/api/users/:userId/calendar", (req, res) => {
        let { userId } = req.params;
        if (userId === "current") {
            const currentUser = req.session.currentUser;
            if (!currentUser) return res.sendStatus(401);
            userId = currentUser._id;
        }
        res.json(dao.findEventsForUser(userId));
    });
}
