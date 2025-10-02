let todos = [
    { id: 1, title: "Task 1", completed: false },
    { id: 2, title: "Task 2", completed: true },
    { id: 3, title: "Task 3", completed: false },
    { id: 4, title: "Task 4", completed: true },
];

export default function WorkingWithArrays(app) {
    // GET all (with optional ?completed=true|false)
    app.get("/lab5/todos", (req, res) => {
        const { completed } = req.query;
        if (completed === undefined) return res.json(todos);
        const completedBool = completed === "true";
        return res.json(todos.filter((t) => t.completed === completedBool));
    });

    // GET by id
    app.get("/lab5/todos/:id", (req, res) => {
        const todo = todos.find((t) => t.id === parseInt(req.params.id));
        res.json(todo);
    });

    // CREATE (legacy GET + proper POST)
    app.get("/lab5/todos/create", (req, res) => {
        const newTodo = { id: Date.now(), title: "New Task", completed: false };
        todos.push(newTodo);
        res.json(todos);
    });
    app.post("/lab5/todos", (req, res) => {
        const newTodo = { ...req.body, id: Date.now() };
        todos.push(newTodo);
        res.json(newTodo);
    });

    // DELETE (legacy GET + proper DELETE)
    app.get("/lab5/todos/:id/delete", (req, res) => {
        const idx = todos.findIndex((t) => t.id === parseInt(req.params.id));
        if (idx >= 0) todos.splice(idx, 1);
        res.json(todos);
    });
    app.delete("/lab5/todos/:id", (req, res) => {
        const idx = todos.findIndex((t) => t.id === parseInt(req.params.id));
        if (idx === -1)
            return res.status(404).json({ message: `Unable to delete Todo with ID ${req.params.id}` });
        todos.splice(idx, 1);
        res.sendStatus(200);
    });

    // UPDATE title (legacy GET) and PUT (full/partial)
    app.get("/lab5/todos/:id/title/:title", (req, res) => {
        const todo = todos.find((t) => t.id === parseInt(req.params.id));
        if (todo) todo.title = req.params.title;
        res.json(todos);
    });
    app.put("/lab5/todos/:id", (req, res) => {
        const id = parseInt(req.params.id);
        const idx = todos.findIndex((t) => t.id === id);
        if (idx === -1)
            return res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
        todos[idx] = { ...todos[idx], ...req.body };
        res.sendStatus(200);
    });

    // extra “on your own” routes
    app.get("/lab5/todos/:id/description/:description", (req, res) => {
        const todo = todos.find((t) => t.id === parseInt(req.params.id));
        if (todo) todo.description = req.params.description;
        res.json(todos);
    });
    app.get("/lab5/todos/:id/completed/:completed", (req, res) => {
        const todo = todos.find((t) => t.id === parseInt(req.params.id));
        if (todo) todo.completed = req.params.completed === "true";
        res.json(todos);
    });
}
