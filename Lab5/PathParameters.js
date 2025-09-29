export default function PathParameters(app) {
    const add = (req, res) => {
        const { a, b } = req.params;
        res.send((parseInt(a) + parseInt(b)).toString());
    };
    const subtract = (req, res) => {
        const { a, b } = req.params;
        res.send((parseInt(a) - parseInt(b)).toString());
    };
    const multiply = (req, res) => {
        const { a, b } = req.params;
        res.send((parseInt(a) * parseInt(b)).toString());
    };
    const divide = (req, res) => {
        const { a, b } = req.params;
        res.send((parseInt(a) / parseInt(b)).toString());
    };

    app.get("/lab5/add/:a/:b", add);
    app.get("/lab5/subtract/:a/:b", subtract);
    app.get("/lab5/multiply/:a/:b", multiply);
    app.get("/lab5/divide/:a/:b", divide);
}
