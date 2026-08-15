import * as dao from "./dao.js";

export default function CalendarRoutes(app) {
    // Everything on my calendar, in one request.
    app.get("/api/users/:userId/calendar", async (req, res) => {
        let { userId } = req.params;
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }
        const events = await dao.findEventsForUser(userId);
        res.json(events);
    });
}
