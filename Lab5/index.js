import PathParameters from "./PathParameters.js";
import QueryParameters from "./QueryParameters.js";
import WorkingWithObjects from "./WorkingWithObjects.js";
import WorkingWithArrays from "./WorkingWithArrays.js";

export default function Lab5(app) {
    // The first route of the chapter.
    app.get("/lab5/welcome", (req, res) =>
        res.send("Welcome to Full Stack Development!")
    );

    PathParameters(app);
    QueryParameters(app);
    WorkingWithObjects(app);
    WorkingWithArrays(app);
}
