let todos = [
    { id: 1, title: "Task 1", completed: false },
    { id: 2, title: "Task 2", completed: true },
    { id: 3, title: "Task 3", completed: false },
    { id: 4, title: "Task 4", completed: true },
];

export default function WorkingWithArrays(app) {
    // retrieve all or filter by ?completed=true|false
    const getTodos = (req, res) => {
        const { completed } = req.query;
        if (completed !== undefined) {
            const flag = completed === "true";
            return res.json(todos.filter((t) => t.completed === flag));
        }
        res.json(todos);
    };

    // create (GET version for early labs)
    const createNewTodo = (req, res) => {
        const newTodo = { id: Date.now(), title: "New Task", completed: false };
        todos.push(newTodo);
        res.json(todos);
    };

    // POST create (body)
    const postNewTodo = (req, res) => {
        const newTodo = { ...req.body, id: Date.now() };
        todos.push(newTodo);
        res.json(newTodo);
    };

    // retrieve by id
    const getTodoById = (req, res) => {
        const { id } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        res.json(todo);
    };

    // delete (GET legacy)
    const removeTodo = (req, res) => {
        const { id } = req.params;
        const idx = todos.findIndex((t) => t.id === parseInt(id));
        if (idx !== -1) todos.splice(idx, 1);
        res.json(todos);
    };

    // DELETE proper with 404 handling
    const deleteTodo = (req, res) => {
        const { id } = req.params;
        const idx = todos.findIndex((t) => t.id === parseInt(id));
        if (idx === -1) {
            return res.status(404).json({ message: `Unable to delete Todo with ID ${id}` });
        }
        todos.splice(idx, 1);
        res.sendStatus(200);
    };

    // update title (GET legacy)
    const updateTodoTitle = (req, res) => {
        const { id, title } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        if (todo) todo.title = title;
        res.json(todos);
    };

    // PUT proper (merge body) with 404 handling
    const updateTodo = (req, res) => {
        const { id } = req.params;
        const idx = todos.findIndex((t) => t.id === parseInt(id));
        if (idx === -1) {
            return res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
        }
        todos[idx] = { ...todos[idx], ...req.body };
        res.sendStatus(200);
    };

    // on-your-own: completed/description via GET legacy
    const updateCompletedLegacy = (req, res) => {
        const { id, completed } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        if (todo) todo.completed = completed === "true";
        res.json(todos);
    };
    const updateDescriptionLegacy = (req, res) => {
        const { id, description } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        if (todo) todo.description = description;
        res.json(todos);
    };

    // route order matters
    app.get("/lab5/todos", getTodos);
    app.get("/lab5/todos/create", createNewTodo);
    app.post("/lab5/todos", postNewTodo);
    app.get("/lab5/todos/:id/delete", removeTodo);
    app.delete("/lab5/todos/:id", deleteTodo);
    app.get("/lab5/todos/:id/title/:title", updateTodoTitle);
    app.put("/lab5/todos/:id", updateTodo);
    app.get("/lab5/todos/:id", getTodoById);
    // on-your-own:
    app.get("/lab5/todos/:id/completed/:completed", updateCompletedLegacy);
    app.get("/lab5/todos/:id/description/:description", updateDescriptionLegacy);
}
