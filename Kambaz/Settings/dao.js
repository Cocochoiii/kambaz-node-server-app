import model from "./model.js";

/** Returns preferences for a user, creating defaults if none exist. */
export async function findOrCreateForUser(user) {
    const id = user._id;
    let pref = await model.findById(id).lean();
    if (!pref) {
        const doc = {
            _id: id,
            user: id,
            displayName:
                `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "Your Name",
            email: user.email || "",
            darkMode: false,
            emailAlerts: true,
            pushAlerts: false,
            updatedAt: new Date(),
        };
        const created = await model.create(doc);
        pref = created.toObject();
    }
    return pref;
}

/** Update preferences for a user (partial payload supported). */
export async function updateForUser(userId, payload) {
    payload.updatedAt = new Date();
    await model.updateOne({ _id: userId }, { $set: payload }, { upsert: true });
    return model.findById(userId).lean();
}

/** Reset to sensible defaults based on current user profile. */
export async function resetForUser(user) {
    const defaults = {
        displayName:
            `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "Your Name",
        email: user.email || "",
        darkMode: false,
        emailAlerts: true,
        pushAlerts: false,
        updatedAt: new Date(),
    };
    await model.updateOne(
        { _id: user._id },
        { $set: defaults, $setOnInsert: { user: user._id } },
        { upsert: true }
    );
    return model.findById(user._id).lean();
}
