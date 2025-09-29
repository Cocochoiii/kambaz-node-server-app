import express from "express";
import cors from "cors";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";

const app = express();

// middleware (order matters)
app.use(cors());          // allow all origins for lab
app.use(express.json());  // parse JSON bodies

// routes
Hello(app);
Lab5(app);

// environment port for Render/Heroku, fallback local 4000
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`HTTP server listening on ${PORT}`));
