export default function Hello(app) {
    const sayHello = (req, res) => res.send("Life is good!");
    const sayWelcome = (req, res) =>
        res.send("Welcome to Full Stack Development!");

    app.get("/hello", sayHello); // http://localhost:4000/hello
    app.get("/", sayWelcome);    // http://localhost:4000
}
