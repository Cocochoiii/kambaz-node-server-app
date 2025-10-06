export default [
    { "_id": "Q5610-1-1", "quiz": "Q5610-1", "title": "Most important heading tag", "type": "MC", "points": 1, "choices": ["<head>", "<h1>", "<header>", "<title>"], "answer": "<h1>", "explanation": "Headings use h1..h6; h1 is the highest level." },
    { "_id": "Q5610-1-2", "quiz": "Q5610-1", "title": "Best tag for a nav area", "type": "MC", "points": 1, "choices": ["<menu>", "<navigation>", "<nav>", "<dir>"], "answer": "<nav>" },
    { "_id": "Q5610-1-3", "quiz": "Q5610-1", "title": "Semantic HTML improves accessibility.", "type": "TF", "points": 1, "answer": "True" },

    { "_id": "Q5610-2-1", "quiz": "Q5610-2", "title": "Create a 2-column layout", "type": "MC", "points": 1, "choices": ["position:absolute", "flexbox", "z-index", "filter"], "answer": "flexbox" },
    { "_id": "Q5610-2-2", "quiz": "Q5610-2", "title": "Grid defines rows and columns explicitly.", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5610-2-3", "quiz": "Q5610-2", "title": "CSS specificity order (lowest→highest)", "type": "MC", "points": 1, "choices": ["inline < id < class < element", "element < class < id < inline", "class < id < element < inline", "id < class < element < inline"], "answer": "element < class < id < inline" },

    { "_id": "Q5610-3-1", "quiz": "Q5610-3", "title": "const creates", "type": "MC", "points": 1, "choices": ["immutable binding", "immutable object", "block-scoped function", "global var"], "answer": "immutable binding" },
    { "_id": "Q5610-3-2", "quiz": "Q5610-3", "title": "Arrow functions bind their own this", "type": "TF", "points": 1, "answer": "False", "explanation": "They capture lexical this; they don’t rebind." },
    { "_id": "Q5610-3-3", "quiz": "Q5610-3", "title": "Spread operator copies array elements", "type": "TF", "points": 1, "answer": "True" },

    { "_id": "Q5610-4-1", "quiz": "Q5610-4", "title": "React list key should be", "type": "MC", "points": 1, "choices": ["index always", "stable unique id", "random()", "component name"], "answer": "stable unique id" },
    { "_id": "Q5610-4-2", "quiz": "Q5610-4", "title": "setState is async", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5610-4-3", "quiz": "Q5610-4", "title": "Lift state up to", "type": "MC", "points": 1, "choices": ["nearest common ancestor", "root App", "any sibling", "context"], "answer": "nearest common ancestor" },

    { "_id": "Q5610-5-1", "quiz": "Q5610-5", "title": "Dynamic segment in Next App Router", "type": "MC", "points": 1, "choices": ["[id]", "{id}", ":id", "((id))"], "answer": "[id]" },
    { "_id": "Q5610-5-2", "quiz": "Q5610-5", "title": "Server components can access DB directly", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5610-5-3", "quiz": "Q5610-5", "title": "Client components must declare", "type": "MC", "points": 1, "choices": ["\"use client\"", "\"client component\"", "\"browser true\"", "nothing"], "answer": "\"use client\"" },

    { "_id": "Q5610-6-1", "quiz": "Q5610-6", "title": "HTTP 201 means", "type": "MC", "points": 1, "choices": ["OK", "Created", "No Content", "Moved"], "answer": "Created" },
    { "_id": "Q5610-6-2", "quiz": "Q5610-6", "title": "GET should have a body", "type": "TF", "points": 1, "answer": "False" },
    { "_id": "Q5610-6-3", "quiz": "Q5610-6", "title": "PUT vs PATCH", "type": "MC", "points": 1, "choices": ["PUT partial; PATCH replace", "PUT replace; PATCH partial", "same", "neither"], "answer": "PUT replace; PATCH partial" },

    { "_id": "Q5610-7-1", "quiz": "Q5610-7", "title": "Express middleware signature", "type": "MC", "points": 1, "choices": ["(req,res)", "(req,res,next)", "(res,req)", "(next)"], "answer": "(req,res,next)" },
    { "_id": "Q5610-7-2", "quiz": "Q5610-7", "title": "Error-handling middleware has 4 args", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5610-7-3", "quiz": "Q5610-7", "title": "Static files served by", "type": "MC", "points": 1, "choices": ["express.static()", "express.json()", "cors()", "morgan()"], "answer": "express.static()" },

    { "_id": "Q5610-8-1", "quiz": "Q5610-8", "title": "Mongoose model compiles from", "type": "MC", "points": 1, "choices": ["Collection", "Schema", "Document", "Cursor"], "answer": "Schema" },
    { "_id": "Q5610-8-2", "quiz": "Q5610-8", "title": "ObjectId references enable population", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5610-8-3", "quiz": "Q5610-8", "title": "Unique index guarantees global uniqueness", "type": "TF", "points": 1, "answer": "False", "explanation": "Per collection unless sharded with keys." },

    { "_id": "Q5610-9-1", "quiz": "Q5610-9", "title": "CSR vs SSR trade-off", "type": "SA", "points": 2, "answer": "CSR shifts work to client; SSR improves TTFB/SEO; both can hydrate." },
    { "_id": "Q5610-9-2", "quiz": "Q5610-9", "title": "Explain React reconciliation", "type": "SA", "points": 2, "answer": "Diffing virtual DOM by keys to minimize DOM updates." },
    { "_id": "Q5610-9-3", "quiz": "Q5610-9", "title": "HTTP cache validators", "type": "MC", "points": 1, "choices": ["ETag/If-None-Match", "Cookie", "FormData", "Accept"], "answer": "ETag/If-None-Match" },

    { "_id": "Q5610-10-1", "quiz": "Q5610-10", "title": "JWT best practice", "type": "MC", "points": 1, "choices": ["Store in localStorage", "Short expiry + HTTPS + cookies", "Embed password", "No signature"], "answer": "Short expiry + HTTPS + cookies" },
    { "_id": "Q5610-10-2", "quiz": "Q5610-10", "title": "Zero-downtime deploy strategy", "type": "MC", "points": 1, "choices": ["Blue-green", "Big bang", "Fork", "FTP overwrite"], "answer": "Blue-green" },
    { "_id": "Q5610-10-3", "quiz": "Q5610-10", "title": "Env vars should be committed", "type": "TF", "points": 1, "answer": "False" },

    { "_id": "Q5520-1-1", "quiz": "Q5520-1", "title": "RN core primitive", "type": "MC", "points": 1, "choices": ["div", "View", "section", "frame"], "answer": "View" },
    { "_id": "Q5520-1-2", "quiz": "Q5520-1", "title": "Style system", "type": "MC", "points": 1, "choices": ["CSS files", "Inline string", "StyleSheet objects", "LESS"], "answer": "StyleSheet objects" },
    { "_id": "Q5520-1-3", "quiz": "Q5520-1", "title": "Hot reload speeds iteration", "type": "TF", "points": 1, "answer": "True" },

    { "_id": "Q5520-2-1", "quiz": "Q5520-2", "title": "Pass params between screens", "type": "MC", "points": 1, "choices": ["Context only", "URL query", "navigation.navigate with params", "Global var"], "answer": "navigation.navigate with params" },
    { "_id": "Q5520-2-2", "quiz": "Q5520-2", "title": "Redux stores UI state only", "type": "TF", "points": 1, "answer": "False" },
    { "_id": "Q5520-2-3", "quiz": "Q5520-2", "title": "Deep link integrates with", "type": "MC", "points": 1, "choices": ["Linking", "Clipboard", "AsyncStorage", "Camera"], "answer": "Linking" },

    { "_id": "Q5520-3-1", "quiz": "Q5520-3", "title": "Fetch returns a", "type": "MC", "points": 1, "choices": ["JSON", "Promise", "Stream only", "Request"], "answer": "Promise" },
    { "_id": "Q5520-3-2", "quiz": "Q5520-3", "title": "UseEffect for API calls", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5520-3-3", "quiz": "Q5520-3", "title": "Handle slow networks with", "type": "MC", "points": 1, "choices": ["Blocking UI", "Retries + timeout + indicators", "Infinite spinner", "Crash"], "answer": "Retries + timeout + indicators" },


    { "_id": "Q6620-10-1", "quiz": "Q6620-10", "title": "IaC benefits", "type": "MC", "points": 1, "choices": ["Manual parity", "Repeatability & versioning", "Snowflakes", "Click-ops"], "answer": "Repeatability & versioning" },
    { "_id": "Q6620-10-2", "quiz": "Q6620-10", "title": "SLO measures", "type": "MC", "points": 1, "choices": ["Business OKRs", "Service targets like latency", "CapEx", "Ticket count only"], "answer": "Service targets like latency" },
    { "_id": "Q6620-10-3", "quiz": "Q6620-10", "title": "Secrets in repo are safe", "type": "TF", "points": 1, "answer": "False" }
];
