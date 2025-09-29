export default function QueryParameters(app) {
    const calculator = (req, res) => {
        const { a, b, operation } = req.query;
        const A = parseInt(a), B = parseInt(b);
        let result = "Invalid operation";

        switch (operation) {
            case "add": result = A + B; break;
            case "subtract": result = A - B; break;
            case "multiply": result = A * B; break;
            case "divide": result = A / B; break;
        }
        res.send(result.toString());
    };

    app.get("/lab5/calculator", calculator);
}
