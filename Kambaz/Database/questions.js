const questionsSeed = [
    // ==================== CS5610 Web Development ====================

    // Q1 - HTML
    { "_id": "Q5610-1-1", "quiz": "Q5610-1", "title": "Most important heading tag", "type": "MC", "points": 1, "choices": ["<head>", "<h1>", "<header>", "<title>"], "answer": "<h1>" },
    { "_id": "Q5610-1-2", "quiz": "Q5610-1", "title": "Best tag for navigation area", "type": "MC", "points": 1, "choices": ["<menu>", "<navigation>", "<nav>", "<navbar>"], "answer": "<nav>" },
    { "_id": "Q5610-1-3", "quiz": "Q5610-1", "title": "Semantic HTML improves accessibility", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5610-1-4", "quiz": "Q5610-1", "title": "Tag for independent content", "type": "MC", "points": 1, "choices": ["<section>", "<article>", "<aside>", "<main>"], "answer": "<article>" },
    { "_id": "Q5610-1-5", "quiz": "Q5610-1", "title": "HTML5 input type for email", "type": "MC", "points": 1, "choices": ["text", "email", "mail", "electronic-mail"], "answer": "email" },

    // Q2 - CSS
    { "_id": "Q5610-2-1", "quiz": "Q5610-2", "title": "Create 2-column layout", "type": "MC", "points": 1, "choices": ["position:absolute", "flexbox", "z-index", "filter"], "answer": "flexbox" },
    { "_id": "Q5610-2-2", "quiz": "Q5610-2", "title": "Grid defines rows and columns explicitly", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5610-2-3", "quiz": "Q5610-2", "title": "CSS specificity order (lowest to highest)", "type": "MC", "points": 1, "choices": ["element < class < id < inline", "class < element < id < inline", "id < class < element < inline", "inline < id < class < element"], "answer": "element < class < id < inline" },
    { "_id": "Q5610-2-4", "quiz": "Q5610-2", "title": "Centering with flexbox", "type": "MC", "points": 1, "choices": ["justify-content: center", "text-align: center", "margin: center", "position: center"], "answer": "justify-content: center" },
    { "_id": "Q5610-2-5", "quiz": "Q5610-2", "title": "Box-sizing: border-box includes padding", "type": "TF", "points": 1, "answer": "True" },

    // Q3 - JavaScript & ES6
    { "_id": "Q5610-3-1", "quiz": "Q5610-3", "title": "const creates", "type": "MC", "points": 1, "choices": ["immutable binding", "immutable object", "block-scoped function", "global var"], "answer": "immutable binding" },
    { "_id": "Q5610-3-2", "quiz": "Q5610-3", "title": "Arrow functions bind their own this", "type": "TF", "points": 1, "answer": "False" },
    { "_id": "Q5610-3-3", "quiz": "Q5610-3", "title": "Spread operator copies array elements", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5610-3-4", "quiz": "Q5610-3", "title": "Promise states", "type": "MC", "points": 1, "choices": ["pending/resolved/rejected", "pending/fulfilled/rejected", "waiting/done/error", "start/success/fail"], "answer": "pending/fulfilled/rejected" },
    { "_id": "Q5610-3-5", "quiz": "Q5610-3", "title": "Destructuring arrays", "type": "MC", "points": 1, "choices": ["[a, b] = array", "{a, b} = array", "(a, b) = array", "a, b = array"], "answer": "[a, b] = array" },

    // Q4 - React Components
    { "_id": "Q5610-4-1", "quiz": "Q5610-4", "title": "React list key should be", "type": "MC", "points": 1, "choices": ["index always", "stable unique id", "random()", "component name"], "answer": "stable unique id" },
    { "_id": "Q5610-4-2", "quiz": "Q5610-4", "title": "setState is asynchronous", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5610-4-3", "quiz": "Q5610-4", "title": "Lift state up to", "type": "MC", "points": 1, "choices": ["nearest common ancestor", "root App", "any sibling", "context"], "answer": "nearest common ancestor" },
    { "_id": "Q5610-4-4", "quiz": "Q5610-4", "title": "useEffect runs after render", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5610-4-5", "quiz": "Q5610-4", "title": "Prevent useEffect infinite loop", "type": "MC", "points": 1, "choices": ["Remove useEffect", "Add dependency array", "Use setTimeout", "Call preventDefault"], "answer": "Add dependency array" },

    // Q5 - Next.js Routing
    { "_id": "Q5610-5-1", "quiz": "Q5610-5", "title": "Dynamic segment in Next App Router", "type": "MC", "points": 1, "choices": ["[id]", "{id}", ":id", "((id))"], "answer": "[id]" },
    { "_id": "Q5610-5-2", "quiz": "Q5610-5", "title": "Server components can access DB directly", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5610-5-3", "quiz": "Q5610-5", "title": "Client components must declare", "type": "MC", "points": 1, "choices": ["'use client'", "'client component'", "'browser true'", "nothing"], "answer": "'use client'" },
    { "_id": "Q5610-5-4", "quiz": "Q5610-5", "title": "layout.js wraps page.js", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5610-5-5", "quiz": "Q5610-5", "title": "Parallel routes use", "type": "MC", "points": 1, "choices": ["@folder", "#folder", "$folder", "&folder"], "answer": "@folder" },

    // Q6 - HTTP & Fetch
    { "_id": "Q5610-6-1", "quiz": "Q5610-6", "title": "HTTP 201 means", "type": "MC", "points": 1, "choices": ["OK", "Created", "No Content", "Moved"], "answer": "Created" },
    { "_id": "Q5610-6-2", "quiz": "Q5610-6", "title": "GET should have a body", "type": "TF", "points": 1, "answer": "False" },
    { "_id": "Q5610-6-3", "quiz": "Q5610-6", "title": "PUT vs PATCH", "type": "MC", "points": 1, "choices": ["PUT partial, PATCH replace", "PUT replace, PATCH partial", "Both same", "Neither updates"], "answer": "PUT replace, PATCH partial" },
    { "_id": "Q5610-6-4", "quiz": "Q5610-6", "title": "CORS stands for", "type": "MC", "points": 1, "choices": ["Cross-Origin Resource Sharing", "Client-Origin Request Security", "Cross-Origin Request Service", "Client-Origin Resource System"], "answer": "Cross-Origin Resource Sharing" },
    { "_id": "Q5610-6-5", "quiz": "Q5610-6", "title": "Idempotent methods include GET and PUT", "type": "TF", "points": 1, "answer": "True" },

    // Q7 - Node & Express
    { "_id": "Q5610-7-1", "quiz": "Q5610-7", "title": "Express middleware signature", "type": "MC", "points": 1, "choices": ["(req, res)", "(req, res, next)", "(res, req)", "(next)"], "answer": "(req, res, next)" },
    { "_id": "Q5610-7-2", "quiz": "Q5610-7", "title": "Error middleware has 4 parameters", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5610-7-3", "quiz": "Q5610-7", "title": "Static files served by", "type": "MC", "points": 1, "choices": ["express.static()", "express.json()", "cors()", "morgan()"], "answer": "express.static()" },
    { "_id": "Q5610-7-4", "quiz": "Q5610-7", "title": "app.use() applies middleware globally", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5610-7-5", "quiz": "Q5610-7", "title": "Parse JSON body with", "type": "MC", "points": 1, "choices": ["express.json()", "bodyParser()", "JSON.parse()", "req.json()"], "answer": "express.json()" },

    // Q8 - MongoDB & Mongoose
    { "_id": "Q5610-8-1", "quiz": "Q5610-8", "title": "Mongoose model compiles from", "type": "MC", "points": 1, "choices": ["Collection", "Schema", "Document", "Database"], "answer": "Schema" },
    { "_id": "Q5610-8-2", "quiz": "Q5610-8", "title": "ObjectId references enable population", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5610-8-3", "quiz": "Q5610-8", "title": "MongoDB is schema-less", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5610-8-4", "quiz": "Q5610-8", "title": "Find documents with", "type": "MC", "points": 1, "choices": ["Model.find()", "Model.get()", "Model.select()", "Model.query()"], "answer": "Model.find()" },
    { "_id": "Q5610-8-5", "quiz": "Q5610-8", "title": "Mongoose middleware types", "type": "MC", "points": 1, "choices": ["pre/post", "before/after", "start/end", "init/done"], "answer": "pre/post" },

    // Q9 - Midterm
    { "_id": "Q5610-9-1", "quiz": "Q5610-9", "title": "Virtual DOM benefit", "type": "MC", "points": 2, "choices": ["Direct DOM manipulation", "Efficient reconciliation", "No JavaScript needed", "Server-side only"], "answer": "Efficient reconciliation" },
    { "_id": "Q5610-9-2", "quiz": "Q5610-9", "title": "CSS Grid vs Flexbox", "type": "SA", "points": 3, "answer": "Grid: 2D layouts, Flexbox: 1D layouts" },
    { "_id": "Q5610-9-3", "quiz": "Q5610-9", "title": "React hooks must be called at top level", "type": "TF", "points": 2, "answer": "True" },
    { "_id": "Q5610-9-4", "quiz": "Q5610-9", "title": "HTTP methods safe and idempotent", "type": "SA", "points": 3, "answer": "GET safe+idempotent, POST neither, PUT idempotent, DELETE idempotent" },

    // Q10 - Final
    { "_id": "Q5610-10-1", "quiz": "Q5610-10", "title": "JWT best practice", "type": "MC", "points": 2, "choices": ["Store in localStorage", "Short expiry + httpOnly cookies", "Embed passwords", "Never expire"], "answer": "Short expiry + httpOnly cookies" },
    { "_id": "Q5610-10-2", "quiz": "Q5610-10", "title": "Zero-downtime deployment", "type": "MC", "points": 2, "choices": ["Blue-green", "Big bang", "Direct replace", "FTP upload"], "answer": "Blue-green" },
    { "_id": "Q5610-10-3", "quiz": "Q5610-10", "title": "Database indexing tradeoffs", "type": "SA", "points": 3, "answer": "Faster reads, slower writes, more storage" },
    { "_id": "Q5610-10-4", "quiz": "Q5610-10", "title": "HTTPS uses TLS/SSL", "type": "TF", "points": 2, "answer": "True" },

    // ==================== CS5520 Mobile Development ====================

    // Q1 - Mobile UI Basics
    { "_id": "Q5520-1-1", "quiz": "Q5520-1", "title": "React Native core primitive", "type": "MC", "points": 1, "choices": ["div", "View", "section", "Container"], "answer": "View" },
    { "_id": "Q5520-1-2", "quiz": "Q5520-1", "title": "Style system in RN", "type": "MC", "points": 1, "choices": ["CSS files", "Inline strings", "StyleSheet objects", "SASS"], "answer": "StyleSheet objects" },
    { "_id": "Q5520-1-3", "quiz": "Q5520-1", "title": "Hot reload speeds development", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5520-1-4", "quiz": "Q5520-1", "title": "Text must be in Text component", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5520-1-5", "quiz": "Q5520-1", "title": "Touchable for buttons", "type": "MC", "points": 1, "choices": ["TouchableOpacity", "Button", "Pressable", "All of above"], "answer": "All of above" },

    // Q2 - Navigation & State
    { "_id": "Q5520-2-1", "quiz": "Q5520-2", "title": "Pass params between screens", "type": "MC", "points": 1, "choices": ["Global vars", "navigation.navigate", "AsyncStorage only", "Props only"], "answer": "navigation.navigate" },
    { "_id": "Q5520-2-2", "quiz": "Q5520-2", "title": "Stack navigator provides back button", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5520-2-3", "quiz": "Q5520-2", "title": "Tab navigation types", "type": "MC", "points": 1, "choices": ["Bottom tabs only", "Top tabs only", "Both bottom and top", "Side tabs only"], "answer": "Both bottom and top" },
    { "_id": "Q5520-2-4", "quiz": "Q5520-2", "title": "Redux stores state globally", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5520-2-5", "quiz": "Q5520-2", "title": "Context API alternative to", "type": "MC", "points": 1, "choices": ["Props drilling", "useState", "useEffect", "AsyncStorage"], "answer": "Props drilling" },

    // Q3 - Networking
    { "_id": "Q5520-3-1", "quiz": "Q5520-3", "title": "Fetch returns", "type": "MC", "points": 1, "choices": ["JSON directly", "Promise", "Observable", "Callback"], "answer": "Promise" },
    { "_id": "Q5520-3-2", "quiz": "Q5520-3", "title": "useEffect for API calls", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5520-3-3", "quiz": "Q5520-3", "title": "Handle network errors with", "type": "MC", "points": 1, "choices": ["try-catch", "then-catch", ".error()", "Both try-catch and then-catch"], "answer": "Both try-catch and then-catch" },
    { "_id": "Q5520-3-4", "quiz": "Q5520-3", "title": "Axios vs Fetch difference", "type": "MC", "points": 1, "choices": ["Axios auto-parses JSON", "Fetch is faster", "No difference", "Fetch has interceptors"], "answer": "Axios auto-parses JSON" },
    { "_id": "Q5520-3-5", "quiz": "Q5520-3", "title": "API keys should be hardcoded", "type": "TF", "points": 1, "answer": "False" },

    // Q4 - Local Data
    { "_id": "Q5520-4-1", "quiz": "Q5520-4", "title": "AsyncStorage stores", "type": "MC", "points": 1, "choices": ["Objects directly", "Strings only", "Numbers only", "Any type"], "answer": "Strings only" },
    { "_id": "Q5520-4-2", "quiz": "Q5520-4", "title": "SQLite supports relations", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5520-4-3", "quiz": "Q5520-4", "title": "Realm is", "type": "MC", "points": 1, "choices": ["SQL database", "NoSQL database", "Key-value store", "File system"], "answer": "NoSQL database" },
    { "_id": "Q5520-4-4", "quiz": "Q5520-4", "title": "SecureStore encrypts data", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5520-4-5", "quiz": "Q5520-4", "title": "Data persistence across app updates", "type": "MC", "points": 1, "choices": ["State", "Props", "AsyncStorage", "Variables"], "answer": "AsyncStorage" },

    // Q5 - Auth & Security
    { "_id": "Q5520-5-1", "quiz": "Q5520-5", "title": "Store tokens in", "type": "MC", "points": 1, "choices": ["AsyncStorage plain", "SecureStore", "State only", "Constants"], "answer": "SecureStore" },
    { "_id": "Q5520-5-2", "quiz": "Q5520-5", "title": "Biometric auth available on all devices", "type": "TF", "points": 1, "answer": "False" },
    { "_id": "Q5520-5-3", "quiz": "Q5520-5", "title": "OAuth flow type for mobile", "type": "MC", "points": 1, "choices": ["Implicit", "Authorization Code + PKCE", "Password", "Client Credentials"], "answer": "Authorization Code + PKCE" },
    { "_id": "Q5520-5-4", "quiz": "Q5520-5", "title": "Refresh tokens are long-lived", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5520-5-5", "quiz": "Q5520-5", "title": "Certificate pinning prevents", "type": "MC", "points": 1, "choices": ["XSS", "MITM attacks", "SQL injection", "Memory leaks"], "answer": "MITM attacks" },

    // Q6 - Background & Notifications
    { "_id": "Q5520-6-1", "quiz": "Q5520-6", "title": "Push notifications require", "type": "MC", "points": 1, "choices": ["User permission", "Payment", "Root access", "WiFi only"], "answer": "User permission" },
    { "_id": "Q5520-6-2", "quiz": "Q5520-6", "title": "Background tasks unlimited on iOS", "type": "TF", "points": 1, "answer": "False" },
    { "_id": "Q5520-6-3", "quiz": "Q5520-6", "title": "Local notifications need server", "type": "TF", "points": 1, "answer": "False" },
    { "_id": "Q5520-6-4", "quiz": "Q5520-6", "title": "FCM stands for", "type": "MC", "points": 1, "choices": ["Firebase Cloud Messaging", "Fast Cache Memory", "File Cloud Manager", "Frontend Cache Module"], "answer": "Firebase Cloud Messaging" },
    { "_id": "Q5520-6-5", "quiz": "Q5520-6", "title": "Background fetch interval", "type": "MC", "points": 1, "choices": ["Fixed 15 min", "System controlled", "User defined", "1 hour minimum"], "answer": "System controlled" },

    // Q7 - Sensors & Camera
    { "_id": "Q5520-7-1", "quiz": "Q5520-7", "title": "Camera permission required", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5520-7-2", "quiz": "Q5520-7", "title": "Geolocation accuracy modes", "type": "MC", "points": 1, "choices": ["High only", "Low only", "High/Low/Balanced", "GPS only"], "answer": "High/Low/Balanced" },
    { "_id": "Q5520-7-3", "quiz": "Q5520-7", "title": "Accelerometer measures", "type": "MC", "points": 1, "choices": ["Speed", "Acceleration", "Distance", "Temperature"], "answer": "Acceleration" },
    { "_id": "Q5520-7-4", "quiz": "Q5520-7", "title": "Image picker can access", "type": "MC", "points": 1, "choices": ["Camera only", "Gallery only", "Both camera and gallery", "Files only"], "answer": "Both camera and gallery" },
    { "_id": "Q5520-7-5", "quiz": "Q5520-7", "title": "Gyroscope detects rotation", "type": "TF", "points": 1, "answer": "True" },

    // Q8 - Performance & Accessibility
    { "_id": "Q5520-8-1", "quiz": "Q5520-8", "title": "FlatList vs ScrollView", "type": "MC", "points": 1, "choices": ["FlatList for long lists", "ScrollView always better", "No difference", "FlatList deprecated"], "answer": "FlatList for long lists" },
    { "_id": "Q5520-8-2", "quiz": "Q5520-8", "title": "Memoization prevents re-renders", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5520-8-3", "quiz": "Q5520-8", "title": "Accessibility prop for screen readers", "type": "MC", "points": 1, "choices": ["aria-label", "accessibilityLabel", "alt", "title"], "answer": "accessibilityLabel" },
    { "_id": "Q5520-8-4", "quiz": "Q5520-8", "title": "Hermes improves", "type": "MC", "points": 1, "choices": ["UI design", "JS performance", "Network speed", "Camera quality"], "answer": "JS performance" },
    { "_id": "Q5520-8-5", "quiz": "Q5520-8", "title": "Images should be optimized", "type": "TF", "points": 1, "answer": "True" },

    // Q9 - Midterm
    { "_id": "Q5520-9-1", "quiz": "Q5520-9", "title": "Bridge architecture in RN", "type": "SA", "points": 3, "answer": "JS thread communicates with native via bridge" },
    { "_id": "Q5520-9-2", "quiz": "Q5520-9", "title": "Platform-specific code methods", "type": "MC", "points": 2, "choices": ["Platform.OS only", "File extensions only", "Both Platform.OS and .ios.js/.android.js", "Conditional compilation"], "answer": "Both Platform.OS and .ios.js/.android.js" },
    { "_id": "Q5520-9-3", "quiz": "Q5520-9", "title": "Expo vs React Native CLI", "type": "SA", "points": 3, "answer": "Expo: easier setup, limited native; CLI: full control, complex" },
    { "_id": "Q5520-9-4", "quiz": "Q5520-9", "title": "Animation libraries include Animated API", "type": "TF", "points": 2, "answer": "True" },

    // Q10 - Final
    { "_id": "Q5520-10-1", "quiz": "Q5520-10", "title": "App store submission requires", "type": "MC", "points": 2, "choices": ["Code only", "Signed build + metadata", "APK only", "Source code"], "answer": "Signed build + metadata" },
    { "_id": "Q5520-10-2", "quiz": "Q5520-10", "title": "CodePush enables OTA updates", "type": "TF", "points": 2, "answer": "True" },
    { "_id": "Q5520-10-3", "quiz": "Q5520-10", "title": "Testing types for mobile", "type": "SA", "points": 3, "answer": "Unit, Integration, E2E, Manual device testing" },
    { "_id": "Q5520-10-4", "quiz": "Q5520-10", "title": "Deep linking configuration", "type": "MC", "points": 2, "choices": ["JS only", "Native only", "Both JS and native", "Automatic"], "answer": "Both JS and native" },

    // ==================== CS5004 Object-Oriented Design ====================

    // Q1 - OOP Basics
    { "_id": "Q5004-1-1", "quiz": "Q5004-1", "title": "Encapsulation hides", "type": "MC", "points": 1, "choices": ["Interface", "Implementation", "Inheritance", "Identity"], "answer": "Implementation" },
    { "_id": "Q5004-1-2", "quiz": "Q5004-1", "title": "Object contains state and behavior", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5004-1-3", "quiz": "Q5004-1", "title": "Class vs Object", "type": "MC", "points": 1, "choices": ["Class is instance", "Object is blueprint", "Class is blueprint", "Same thing"], "answer": "Class is blueprint" },
    { "_id": "Q5004-1-4", "quiz": "Q5004-1", "title": "Constructor purpose", "type": "MC", "points": 1, "choices": ["Destroy object", "Initialize object", "Define class", "Import modules"], "answer": "Initialize object" },
    { "_id": "Q5004-1-5", "quiz": "Q5004-1", "title": "Static methods need object instance", "type": "TF", "points": 1, "answer": "False" },

    // Q2 - Interfaces & Generics
    { "_id": "Q5004-2-1", "quiz": "Q5004-2", "title": "Interface defines", "type": "MC", "points": 1, "choices": ["Implementation", "Contract", "Variables only", "Private methods"], "answer": "Contract" },
    { "_id": "Q5004-2-2", "quiz": "Q5004-2", "title": "Multiple inheritance via interfaces", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5004-2-3", "quiz": "Q5004-2", "title": "Generic type parameter syntax", "type": "MC", "points": 1, "choices": ["<T>", "[T]", "{T}", "(T)"], "answer": "<T>" },
    { "_id": "Q5004-2-4", "quiz": "Q5004-2", "title": "Abstract class can have implementation", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5004-2-5", "quiz": "Q5004-2", "title": "Bounded generics restrict", "type": "MC", "points": 1, "choices": ["Memory usage", "Type parameters", "Method count", "Inheritance depth"], "answer": "Type parameters" },

    // Q3 - UML Essentials
    { "_id": "Q5004-3-1", "quiz": "Q5004-3", "title": "UML aggregation symbol", "type": "MC", "points": 1, "choices": ["Filled diamond", "Empty diamond", "Arrow", "Line"], "answer": "Empty diamond" },
    { "_id": "Q5004-3-2", "quiz": "Q5004-3", "title": "Sequence diagrams show object interactions", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5004-3-3", "quiz": "Q5004-3", "title": "Class diagram sections", "type": "MC", "points": 1, "choices": ["Name only", "Name/Attributes", "Name/Attributes/Methods", "Methods only"], "answer": "Name/Attributes/Methods" },
    { "_id": "Q5004-3-4", "quiz": "Q5004-3", "title": "+ symbol means", "type": "MC", "points": 1, "choices": ["Private", "Public", "Protected", "Static"], "answer": "Public" },
    { "_id": "Q5004-3-5", "quiz": "Q5004-3", "title": "Use case diagrams show implementation", "type": "TF", "points": 1, "answer": "False" },

    // Q4 - SOLID Principles
    { "_id": "Q5004-4-1", "quiz": "Q5004-4", "title": "S in SOLID", "type": "MC", "points": 1, "choices": ["Secure", "Single Responsibility", "Scalable", "Simple"], "answer": "Single Responsibility" },
    { "_id": "Q5004-4-2", "quiz": "Q5004-4", "title": "Open/Closed means", "type": "MC", "points": 1, "choices": ["Open for modification", "Closed for extension", "Open for extension, closed for modification", "Always open"], "answer": "Open for extension, closed for modification" },
    { "_id": "Q5004-4-3", "quiz": "Q5004-4", "title": "Liskov Substitution about inheritance", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5004-4-4", "quiz": "Q5004-4", "title": "Interface Segregation prevents", "type": "MC", "points": 1, "choices": ["Fat interfaces", "Thin interfaces", "No interfaces", "Multiple interfaces"], "answer": "Fat interfaces" },
    { "_id": "Q5004-4-5", "quiz": "Q5004-4", "title": "Dependency Inversion promotes abstractions", "type": "TF", "points": 1, "answer": "True" },

    // Q5 - Patterns I
    { "_id": "Q5004-5-1", "quiz": "Q5004-5", "title": "Strategy pattern enables", "type": "MC", "points": 1, "choices": ["Algorithm selection at runtime", "Object creation", "Interface implementation", "Static binding"], "answer": "Algorithm selection at runtime" },
    { "_id": "Q5004-5-2", "quiz": "Q5004-5", "title": "Decorator adds behavior dynamically", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5004-5-3", "quiz": "Q5004-5", "title": "Factory pattern category", "type": "MC", "points": 1, "choices": ["Creational", "Structural", "Behavioral", "Architectural"], "answer": "Creational" },
    { "_id": "Q5004-5-4", "quiz": "Q5004-5", "title": "Singleton ensures", "type": "MC", "points": 1, "choices": ["Multiple instances", "Single instance", "No instances", "Two instances"], "answer": "Single instance" },
    { "_id": "Q5004-5-5", "quiz": "Q5004-5", "title": "Builder pattern handles complex construction", "type": "TF", "points": 1, "answer": "True" },

    // Q6 - Patterns II
    { "_id": "Q5004-6-1", "quiz": "Q5004-6", "title": "Observer pattern implements", "type": "MC", "points": 1, "choices": ["One-to-one", "One-to-many", "Many-to-many", "Many-to-one"], "answer": "One-to-many" },
    { "_id": "Q5004-6-2", "quiz": "Q5004-6", "title": "Adapter makes incompatible interfaces work", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5004-6-3", "quiz": "Q5004-6", "title": "Command pattern encapsulates", "type": "MC", "points": 1, "choices": ["Data", "Requests", "Responses", "Errors"], "answer": "Requests" },
    { "_id": "Q5004-6-4", "quiz": "Q5004-6", "title": "Facade simplifies complex subsystems", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5004-6-5", "quiz": "Q5004-6", "title": "Iterator pattern provides", "type": "MC", "points": 1, "choices": ["Random access", "Sequential access", "Direct access", "No access"], "answer": "Sequential access" },

    // Q7 - Testing & TDD
    { "_id": "Q5004-7-1", "quiz": "Q5004-7", "title": "TDD cycle", "type": "MC", "points": 1, "choices": ["Red-Green-Refactor", "Write-Test-Debug", "Plan-Code-Test", "Test-Code-Deploy"], "answer": "Red-Green-Refactor" },
    { "_id": "Q5004-7-2", "quiz": "Q5004-7", "title": "Unit tests should be independent", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5004-7-3", "quiz": "Q5004-7", "title": "Mock objects simulate", "type": "MC", "points": 1, "choices": ["Real objects", "Dependencies", "Test data", "User input"], "answer": "Dependencies" },
    { "_id": "Q5004-7-4", "quiz": "Q5004-7", "title": "Code coverage measures", "type": "MC", "points": 1, "choices": ["Performance", "Lines tested", "Bug count", "Complexity"], "answer": "Lines tested" },
    { "_id": "Q5004-7-5", "quiz": "Q5004-7", "title": "Integration tests test components together", "type": "TF", "points": 1, "answer": "True" },

    // Q8 - Refactoring
    { "_id": "Q5004-8-1", "quiz": "Q5004-8", "title": "Code smell indicates", "type": "MC", "points": 1, "choices": ["Bug", "Design problem", "Performance issue", "Security flaw"], "answer": "Design problem" },
    { "_id": "Q5004-8-2", "quiz": "Q5004-8", "title": "Refactoring changes external behavior", "type": "TF", "points": 1, "answer": "False" },
    { "_id": "Q5004-8-3", "quiz": "Q5004-8", "title": "Long method smell fixed by", "type": "MC", "points": 1, "choices": ["Adding comments", "Extract method", "Adding parameters", "Ignoring it"], "answer": "Extract method" },
    { "_id": "Q5004-8-4", "quiz": "Q5004-8", "title": "DRY principle means", "type": "MC", "points": 1, "choices": ["Don't Repeat Yourself", "Do Repeat Yourself", "Debug Repeatedly Yourself", "Deploy Right Yesterday"], "answer": "Don't Repeat Yourself" },
    { "_id": "Q5004-8-5", "quiz": "Q5004-8", "title": "Shotgun surgery affects many classes", "type": "TF", "points": 1, "answer": "True" },

    // Q9 - Midterm
    { "_id": "Q5004-9-1", "quiz": "Q5004-9", "title": "Polymorphism types", "type": "SA", "points": 3, "answer": "Compile-time (overloading) and Runtime (overriding)" },
    { "_id": "Q5004-9-2", "quiz": "Q5004-9", "title": "Composition over inheritance because", "type": "MC", "points": 2, "choices": ["More flexible", "Always faster", "Less code", "Simpler syntax"], "answer": "More flexible" },
    { "_id": "Q5004-9-3", "quiz": "Q5004-9", "title": "Design patterns solve recurring problems", "type": "TF", "points": 2, "answer": "True" },
    { "_id": "Q5004-9-4", "quiz": "Q5004-9", "title": "GRASP principles", "type": "SA", "points": 3, "answer": "Guidelines for assigning responsibilities to classes" },

    // Q10 - Final
    { "_id": "Q5004-10-1", "quiz": "Q5004-10", "title": "Microservices vs Monolith", "type": "SA", "points": 3, "answer": "Micro: scalable, complex; Mono: simple, coupled" },
    { "_id": "Q5004-10-2", "quiz": "Q5004-10", "title": "Continuous refactoring important", "type": "TF", "points": 2, "answer": "True" },
    { "_id": "Q5004-10-3", "quiz": "Q5004-10", "title": "Architecture patterns include", "type": "MC", "points": 2, "choices": ["MVC, MVP, MVVM", "HTML, CSS, JS", "GET, POST, PUT", "TCP, UDP, HTTP"], "answer": "MVC, MVP, MVVM" },
    { "_id": "Q5004-10-4", "quiz": "Q5004-10", "title": "Domain-Driven Design focuses on", "type": "MC", "points": 2, "choices": ["UI", "Database", "Business domain", "Performance"], "answer": "Business domain" },

    // ==================== CS5200 Database Management ====================

    // Q1 - ER & Relational
    { "_id": "Q5200-1-1", "quiz": "Q5200-1", "title": "Primary key must be", "type": "MC", "points": 1, "choices": ["Nullable", "Unique and not null", "Foreign key", "Composite"], "answer": "Unique and not null" },
    { "_id": "Q5200-1-2", "quiz": "Q5200-1", "title": "Cardinality shows relationship count", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5200-1-3", "quiz": "Q5200-1", "title": "Weak entity needs", "type": "MC", "points": 1, "choices": ["No key", "Own key", "Owner entity", "Multiple keys"], "answer": "Owner entity" },
    { "_id": "Q5200-1-4", "quiz": "Q5200-1", "title": "Foreign key references", "type": "MC", "points": 1, "choices": ["Same table only", "Primary key in another table", "Any column", "Index only"], "answer": "Primary key in another table" },
    { "_id": "Q5200-1-5", "quiz": "Q5200-1", "title": "Many-to-many needs junction table", "type": "TF", "points": 1, "answer": "True" },

    // Q2 - SQL Basics
    { "_id": "Q5200-2-1", "quiz": "Q5200-2", "title": "JOIN default type", "type": "MC", "points": 1, "choices": ["LEFT", "RIGHT", "INNER", "FULL"], "answer": "INNER" },
    { "_id": "Q5200-2-2", "quiz": "Q5200-2", "title": "DELETE is DML", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5200-2-3", "quiz": "Q5200-2", "title": "CREATE TABLE is", "type": "MC", "points": 1, "choices": ["DML", "DDL", "DCL", "TCL"], "answer": "DDL" },
    { "_id": "Q5200-2-4", "quiz": "Q5200-2", "title": "WHERE filters before grouping", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5200-2-5", "quiz": "Q5200-2", "title": "DISTINCT removes", "type": "MC", "points": 1, "choices": ["Nulls", "Duplicates", "Errors", "Indexes"], "answer": "Duplicates" },

    // Q3 - Aggregations
    { "_id": "Q5200-3-1", "quiz": "Q5200-3", "title": "GROUP BY requires", "type": "MC", "points": 1, "choices": ["ORDER BY", "Aggregate function or SELECT column", "HAVING", "JOIN"], "answer": "Aggregate function or SELECT column" },
    { "_id": "Q5200-3-2", "quiz": "Q5200-3", "title": "HAVING filters after grouping", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5200-3-3", "quiz": "Q5200-3", "title": "Window function uses", "type": "MC", "points": 1, "choices": ["GROUP BY", "OVER clause", "HAVING", "WHERE"], "answer": "OVER clause" },
    { "_id": "Q5200-3-4", "quiz": "Q5200-3", "title": "COUNT(*) includes nulls", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5200-3-5", "quiz": "Q5200-3", "title": "AVG ignores", "type": "MC", "points": 1, "choices": ["Zeros", "Nulls", "Negatives", "Duplicates"], "answer": "Nulls" },

    // Q4 - Normalization
    { "_id": "Q5200-4-1", "quiz": "Q5200-4", "title": "1NF requires", "type": "MC", "points": 1, "choices": ["No repeating groups", "Full functional dependency", "No transitive dependency", "BCNF"], "answer": "No repeating groups" },
    { "_id": "Q5200-4-2", "quiz": "Q5200-4", "title": "3NF eliminates transitive dependencies", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5200-4-3", "quiz": "Q5200-4", "title": "Denormalization improves", "type": "MC", "points": 1, "choices": ["Data integrity", "Read performance", "Write performance", "Storage"], "answer": "Read performance" },
    { "_id": "Q5200-4-4", "quiz": "Q5200-4", "title": "Functional dependency X→Y means", "type": "MC", "points": 1, "choices": ["Y determines X", "X determines Y", "X equals Y", "X joins Y"], "answer": "X determines Y" },
    { "_id": "Q5200-4-5", "quiz": "Q5200-4", "title": "BCNF stricter than 3NF", "type": "TF", "points": 1, "answer": "True" },

    // Q5 - Indexes & Plans
    { "_id": "Q5200-5-1", "quiz": "Q5200-5", "title": "Index improves", "type": "MC", "points": 1, "choices": ["INSERT speed", "SELECT speed", "DELETE speed", "Storage size"], "answer": "SELECT speed" },
    { "_id": "Q5200-5-2", "quiz": "Q5200-5", "title": "B-tree indexes are sorted", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5200-5-3", "quiz": "Q5200-5", "title": "EXPLAIN shows", "type": "MC", "points": 1, "choices": ["Data", "Query plan", "Errors", "Schema"], "answer": "Query plan" },
    { "_id": "Q5200-5-4", "quiz": "Q5200-5", "title": "Covering index contains", "type": "MC", "points": 1, "choices": ["Primary key only", "All query columns", "Foreign keys", "One column"], "answer": "All query columns" },
    { "_id": "Q5200-5-5", "quiz": "Q5200-5", "title": "Too many indexes slow writes", "type": "TF", "points": 1, "answer": "True" },

    // Q6 - Transactions
    { "_id": "Q5200-6-1", "quiz": "Q5200-6", "title": "ACID: A stands for", "type": "MC", "points": 1, "choices": ["Availability", "Atomicity", "Authentication", "Authorization"], "answer": "Atomicity" },
    { "_id": "Q5200-6-2", "quiz": "Q5200-6", "title": "Isolation prevents dirty reads", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5200-6-3", "quiz": "Q5200-6", "title": "Deadlock occurs when", "type": "MC", "points": 1, "choices": ["Transaction fails", "Circular wait", "Rollback", "Commit"], "answer": "Circular wait" },
    { "_id": "Q5200-6-4", "quiz": "Q5200-6", "title": "COMMIT makes changes permanent", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5200-6-5", "quiz": "Q5200-6", "title": "Serializable isolation level", "type": "MC", "points": 1, "choices": ["Fastest", "Most strict", "Default", "Deprecated"], "answer": "Most strict" },

    // Q7 - Views & Security
    { "_id": "Q5200-7-1", "quiz": "Q5200-7", "title": "View is", "type": "MC", "points": 1, "choices": ["Physical table", "Virtual table", "Index", "Constraint"], "answer": "Virtual table" },
    { "_id": "Q5200-7-2", "quiz": "Q5200-7", "title": "Materialized views store data", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5200-7-3", "quiz": "Q5200-7", "title": "GRANT gives", "type": "MC", "points": 1, "choices": ["Permissions", "Data", "Schema", "Indexes"], "answer": "Permissions" },
    { "_id": "Q5200-7-4", "quiz": "Q5200-7", "title": "Row-level security filters", "type": "MC", "points": 1, "choices": ["Columns", "Rows", "Tables", "Databases"], "answer": "Rows" },
    { "_id": "Q5200-7-5", "quiz": "Q5200-7", "title": "SQL injection prevented by", "type": "MC", "points": 1, "choices": ["Concatenation", "Prepared statements", "Dynamic SQL", "Trust"], "answer": "Prepared statements" },

    // Q8 - Backup & Migration
    { "_id": "Q5200-8-1", "quiz": "Q5200-8", "title": "Full backup includes", "type": "MC", "points": 1, "choices": ["Changes only", "Everything", "Schema only", "Indexes only"], "answer": "Everything" },
    { "_id": "Q5200-8-2", "quiz": "Q5200-8", "title": "Point-in-time recovery needs logs", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5200-8-3", "quiz": "Q5200-8", "title": "Migration changes", "type": "MC", "points": 1, "choices": ["Data only", "Schema", "Users only", "Permissions only"], "answer": "Schema" },
    { "_id": "Q5200-8-4", "quiz": "Q5200-8", "title": "Incremental backup saves", "type": "MC", "points": 1, "choices": ["Everything", "Changes since last backup", "Schema", "Indexes"], "answer": "Changes since last backup" },
    { "_id": "Q5200-8-5", "quiz": "Q5200-8", "title": "Replication provides redundancy", "type": "TF", "points": 1, "answer": "True" },

    // Q9 - Midterm
    { "_id": "Q5200-9-1", "quiz": "Q5200-9", "title": "CAP theorem tradeoffs", "type": "SA", "points": 3, "answer": "Consistency, Availability, Partition tolerance - pick 2" },
    { "_id": "Q5200-9-2", "quiz": "Q5200-9", "title": "NoSQL vs SQL", "type": "SA", "points": 3, "answer": "NoSQL: flexible schema, horizontal scale; SQL: ACID, relationships" },
    { "_id": "Q5200-9-3", "quiz": "Q5200-9", "title": "Sharding distributes data horizontally", "type": "TF", "points": 2, "answer": "True" },
    { "_id": "Q5200-9-4", "quiz": "Q5200-9", "title": "Query optimization techniques", "type": "MC", "points": 2, "choices": ["Indexes, query rewrite, statistics", "More RAM only", "Bigger disk", "Restart server"], "answer": "Indexes, query rewrite, statistics" },

    // Q10 - Final
    { "_id": "Q5200-10-1", "quiz": "Q5200-10", "title": "Two-phase commit ensures", "type": "MC", "points": 2, "choices": ["Speed", "Distributed transaction consistency", "Simplicity", "NoSQL support"], "answer": "Distributed transaction consistency" },
    { "_id": "Q5200-10-2", "quiz": "Q5200-10", "title": "Data warehouse vs OLTP", "type": "SA", "points": 3, "answer": "Warehouse: analytical, denormalized; OLTP: transactional, normalized" },
    { "_id": "Q5200-10-3", "quiz": "Q5200-10", "title": "Eventual consistency in distributed systems", "type": "TF", "points": 2, "answer": "True" },
    { "_id": "Q5200-10-4", "quiz": "Q5200-10", "title": "Database security layers", "type": "SA", "points": 3, "answer": "Network, authentication, authorization, encryption, auditing" },

    // ==================== CS5800 Algorithms ====================

    // Q1 - Asymptotics
    { "_id": "Q5800-1-1", "quiz": "Q5800-1", "title": "Big-O represents", "type": "MC", "points": 1, "choices": ["Lower bound", "Upper bound", "Exact time", "Average case"], "answer": "Upper bound" },
    { "_id": "Q5800-1-2", "quiz": "Q5800-1", "title": "Ω represents lower bound", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5800-1-3", "quiz": "Q5800-1", "title": "Θ means", "type": "MC", "points": 1, "choices": ["Worst case", "Best case", "Tight bound", "Space only"], "answer": "Tight bound" },
    { "_id": "Q5800-1-4", "quiz": "Q5800-1", "title": "O(n²) faster than O(n log n)", "type": "TF", "points": 1, "answer": "False" },
    { "_id": "Q5800-1-5", "quiz": "Q5800-1", "title": "Constants matter in Big-O", "type": "TF", "points": 1, "answer": "False" },

    // Q2 - Recurrences
    { "_id": "Q5800-2-1", "quiz": "Q5800-2", "title": "Master theorem solves", "type": "MC", "points": 1, "choices": ["All recurrences", "Divide-and-conquer recurrences", "Linear only", "Loops"], "answer": "Divide-and-conquer recurrences" },
    { "_id": "Q5800-2-2", "quiz": "Q5800-2", "title": "T(n) = 2T(n/2) + n is", "type": "MC", "points": 1, "choices": ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], "answer": "O(n log n)" },
    { "_id": "Q5800-2-3", "quiz": "Q5800-2", "title": "Substitution method requires guess", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5800-2-4", "quiz": "Q5800-2", "title": "Recursion tree visualizes", "type": "MC", "points": 1, "choices": ["Data structure", "Recursive calls", "Memory", "Output"], "answer": "Recursive calls" },
    { "_id": "Q5800-2-5", "quiz": "Q5800-2", "title": "Base case necessary for recurrence", "type": "TF", "points": 1, "answer": "True" },

    // Q3 - Sorting
    { "_id": "Q5800-3-1", "quiz": "Q5800-3", "title": "Quicksort worst case", "type": "MC", "points": 1, "choices": ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], "answer": "O(n²)" },
    { "_id": "Q5800-3-2", "quiz": "Q5800-3", "title": "Mergesort is stable", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5800-3-3", "quiz": "Q5800-3", "title": "Heapsort space complexity", "type": "MC", "points": 1, "choices": ["O(1)", "O(log n)", "O(n)", "O(n²)"], "answer": "O(1)" },
    { "_id": "Q5800-3-4", "quiz": "Q5800-3", "title": "Counting sort requires", "type": "MC", "points": 1, "choices": ["Comparisons", "Integer keys in range", "Linked list", "Recursion"], "answer": "Integer keys in range" },
    { "_id": "Q5800-3-5", "quiz": "Q5800-3", "title": "Lower bound for comparison sort", "type": "MC", "points": 1, "choices": ["O(n)", "O(n log n)", "O(n²)", "O(1)"], "answer": "O(n log n)" },

    // Q4 - Hashing
    { "_id": "Q5800-4-1", "quiz": "Q5800-4", "title": "Hash collision resolution", "type": "MC", "points": 1, "choices": ["Ignore", "Chaining or open addressing", "Error", "Restart"], "answer": "Chaining or open addressing" },
    { "_id": "Q5800-4-2", "quiz": "Q5800-4", "title": "Load factor α = n/m", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5800-4-3", "quiz": "Q5800-4", "title": "Perfect hash function", "type": "MC", "points": 1, "choices": ["No collisions", "Fast", "Simple", "Recursive"], "answer": "No collisions" },
    { "_id": "Q5800-4-4", "quiz": "Q5800-4", "title": "Open addressing uses", "type": "MC", "points": 1, "choices": ["Linked lists", "Probing", "Trees", "Stacks"], "answer": "Probing" },
    { "_id": "Q5800-4-5", "quiz": "Q5800-4", "title": "Universal hashing prevents worst case", "type": "TF", "points": 1, "answer": "True" },

    // Q5 - Trees
    { "_id": "Q5800-5-1", "quiz": "Q5800-5", "title": "BST worst case height", "type": "MC", "points": 1, "choices": ["O(1)", "O(log n)", "O(n)", "O(n²)"], "answer": "O(n)" },
    { "_id": "Q5800-5-2", "quiz": "Q5800-5", "title": "AVL trees are balanced", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5800-5-3", "quiz": "Q5800-5", "title": "Red-black tree height", "type": "MC", "points": 1, "choices": ["O(1)", "O(log n)", "O(n)", "O(n²)"], "answer": "O(log n)" },
    { "_id": "Q5800-5-4", "quiz": "Q5800-5", "title": "B-tree used in", "type": "MC", "points": 1, "choices": ["RAM only", "Databases", "Sorting", "Hashing"], "answer": "Databases" },
    { "_id": "Q5800-5-5", "quiz": "Q5800-5", "title": "Rotations maintain BST property", "type": "TF", "points": 1, "answer": "True" },

    // Q6 - Graphs I
    { "_id": "Q5800-6-1", "quiz": "Q5800-6", "title": "BFS uses", "type": "MC", "points": 1, "choices": ["Stack", "Queue", "Priority queue", "Tree"], "answer": "Queue" },
    { "_id": "Q5800-6-2", "quiz": "Q5800-6", "title": "DFS can detect cycles", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q5800-6-3", "quiz": "Q5800-6", "title": "Graph representation tradeoff", "type": "MC", "points": 1, "choices": ["Adjacency list: space, Matrix: edge lookup", "Both same", "Matrix always better", "List always better"], "answer": "Adjacency list: space, Matrix: edge lookup" },
    { "_id": "Q5800-6-4", "quiz": "Q5800-6", "title": "Connected components found by", "type": "MC", "points": 1, "choices": ["Sorting", "DFS/BFS", "Hashing", "Greedy"], "answer": "DFS/BFS" },
    { "_id": "Q5800-6-5", "quiz": "Q5800-6", "title": "DAG has no cycles", "type": "TF", "points": 1, "answer": "True" },

    // Q7 - Graphs II
    { "_id": "Q5800-7-1", "quiz": "Q5800-7", "title": "Dijkstra's handles negative edges", "type": "TF", "points": 1, "answer": "False" },
    { "_id": "Q5800-7-2", "quiz": "Q5800-7", "title": "Bellman-Ford complexity", "type": "MC", "points": 1, "choices": ["O(V)", "O(E)", "O(VE)", "O(V²)"], "answer": "O(VE)" },
    { "_id": "Q5800-7-3", "quiz": "Q5800-7", "title": "MST algorithms", "type": "MC", "points": 1, "choices": ["Prim and Kruskal", "DFS and BFS", "Quicksort", "Binary search"], "answer": "Prim and Kruskal" },
    { "_id": "Q5800-7-4", "quiz": "Q5800-7", "title": "Floyd-Warshall finds", "type": "MC", "points": 1, "choices": ["Single source", "All pairs shortest paths", "MST", "Cycles only"], "answer": "All pairs shortest paths" },
    { "_id": "Q5800-7-5", "quiz": "Q5800-7", "title": "Kruskal uses union-find", "type": "TF", "points": 1, "answer": "True" },

    // Q8 - DP & Greedy
    { "_id": "Q5800-8-1", "quiz": "Q5800-8", "title": "DP requires", "type": "MC", "points": 1, "choices": ["Optimal substructure", "Sorting", "Hashing", "Trees"], "answer": "Optimal substructure" },
    { "_id": "Q5800-8-2", "quiz": "Q5800-8", "title": "Greedy always gives optimal", "type": "TF", "points": 1, "answer": "False" },
    { "_id": "Q5800-8-3", "quiz": "Q5800-8", "title": "Fibonacci DP complexity", "type": "MC", "points": 1, "choices": ["O(2ⁿ)", "O(n²)", "O(n)", "O(log n)"], "answer": "O(n)" },
    { "_id": "Q5800-8-4", "quiz": "Q5800-8", "title": "Memoization is", "type": "MC", "points": 1, "choices": ["Bottom-up", "Top-down", "Greedy", "Brute force"], "answer": "Top-down" },
    { "_id": "Q5800-8-5", "quiz": "Q5800-8", "title": "Knapsack problem types", "type": "MC", "points": 1, "choices": ["0/1 and fractional", "Integer only", "Boolean", "Sorted"], "answer": "0/1 and fractional" },

    // Q9 - Midterm
    { "_id": "Q5800-9-1", "quiz": "Q5800-9", "title": "Amortized analysis", "type": "SA", "points": 3, "answer": "Average cost per operation over sequence of operations" },
    { "_id": "Q5800-9-2", "quiz": "Q5800-9", "title": "P vs NP", "type": "SA", "points": 3, "answer": "P: polynomial time solvable, NP: polynomial time verifiable" },
    { "_id": "Q5800-9-3", "quiz": "Q5800-9", "title": "Divide and conquer examples", "type": "MC", "points": 2, "choices": ["Mergesort, Quicksort, Binary Search", "BFS, DFS", "Greedy only", "DP only"], "answer": "Mergesort, Quicksort, Binary Search" },
    { "_id": "Q5800-9-4", "quiz": "Q5800-9", "title": "Space-time tradeoff common", "type": "TF", "points": 2, "answer": "True" },

    // Q10 - Final
    { "_id": "Q5800-10-1", "quiz": "Q5800-10", "title": "NP-complete means", "type": "MC", "points": 2, "choices": ["Easy", "In NP and NP-hard", "Unsolvable", "Linear time"], "answer": "In NP and NP-hard" },
    { "_id": "Q5800-10-2", "quiz": "Q5800-10", "title": "Approximation ratio", "type": "SA", "points": 3, "answer": "Bound on how far approximation is from optimal" },
    { "_id": "Q5800-10-3", "quiz": "Q5800-10", "title": "Reduction proves hardness", "type": "TF", "points": 2, "answer": "True" },
    { "_id": "Q5800-10-4", "quiz": "Q5800-10", "title": "Randomized algorithm types", "type": "MC", "points": 2, "choices": ["Las Vegas and Monte Carlo", "Quick and Merge", "BFS and DFS", "P and NP"], "answer": "Las Vegas and Monte Carlo" },

    // ==================== CS6510 Advanced Software Development ====================

    // Q1 - SE Lifecycle
    { "_id": "Q6510-1-1", "quiz": "Q6510-1", "title": "Agile values", "type": "MC", "points": 1, "choices": ["Documentation over working software", "Individuals over processes", "Contracts over collaboration", "Plans over change"], "answer": "Individuals over processes" },
    { "_id": "Q6510-1-2", "quiz": "Q6510-1", "title": "Scrum sprint length", "type": "MC", "points": 1, "choices": ["1 day", "1-4 weeks", "6 months", "Variable"], "answer": "1-4 weeks" },
    { "_id": "Q6510-1-3", "quiz": "Q6510-1", "title": "Waterfall allows going back phases", "type": "TF", "points": 1, "answer": "False" },
    { "_id": "Q6510-1-4", "quiz": "Q6510-1", "title": "DevOps combines", "type": "MC", "points": 1, "choices": ["Development and Operations", "Design and Testing", "Frontend and Backend", "Business and IT"], "answer": "Development and Operations" },
    { "_id": "Q6510-1-5", "quiz": "Q6510-1", "title": "Kanban limits", "type": "MC", "points": 1, "choices": ["Time", "Work in progress", "Team size", "Budget"], "answer": "Work in progress" },

    // Q2 - Requirements
    { "_id": "Q6510-2-1", "quiz": "Q6510-2", "title": "User story format", "type": "MC", "points": 1, "choices": ["As a... I want... So that...", "Given... When... Then...", "If... Then... Else...", "Subject... Verb... Object..."], "answer": "As a... I want... So that..." },
    { "_id": "Q6510-2-2", "quiz": "Q6510-2", "title": "NFRs include performance", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q6510-2-3", "quiz": "Q6510-2", "title": "Acceptance criteria define", "type": "MC", "points": 1, "choices": ["Budget", "Done condition", "Team", "Technology"], "answer": "Done condition" },
    { "_id": "Q6510-2-4", "quiz": "Q6510-2", "title": "Requirements should be", "type": "MC", "points": 1, "choices": ["Vague", "Testable", "Complex", "Technical"], "answer": "Testable" },
    { "_id": "Q6510-2-5", "quiz": "Q6510-2", "title": "Functional requirements describe what system does", "type": "TF", "points": 1, "answer": "True" },

    // Q3 - Architecture
    { "_id": "Q6510-3-1", "quiz": "Q6510-3", "title": "Microservices communicate via", "type": "MC", "points": 1, "choices": ["Shared memory", "Network APIs", "Files", "Global variables"], "answer": "Network APIs" },
    { "_id": "Q6510-3-2", "quiz": "Q6510-3", "title": "Hexagonal architecture separates", "type": "MC", "points": 1, "choices": ["Business logic and infrastructure", "Frontend and backend", "Data and code", "Tests and code"], "answer": "Business logic and infrastructure" },
    { "_id": "Q6510-3-3", "quiz": "Q6510-3", "title": "Monoliths are always bad", "type": "TF", "points": 1, "answer": "False" },
    { "_id": "Q6510-3-4", "quiz": "Q6510-3", "title": "API versioning strategy", "type": "MC", "points": 1, "choices": ["Never version", "URL or header versioning", "New service always", "Break compatibility"], "answer": "URL or header versioning" },
    { "_id": "Q6510-3-5", "quiz": "Q6510-3", "title": "Event-driven uses pub-sub", "type": "TF", "points": 1, "answer": "True" },

    // Q4 - Testing Strategy
    { "_id": "Q6510-4-1", "quiz": "Q6510-4", "title": "Test pyramid base", "type": "MC", "points": 1, "choices": ["E2E tests", "Unit tests", "Manual tests", "Performance tests"], "answer": "Unit tests" },
    { "_id": "Q6510-4-2", "quiz": "Q6510-4", "title": "Integration tests are fastest", "type": "TF", "points": 1, "answer": "False" },
    { "_id": "Q6510-4-3", "quiz": "Q6510-4", "title": "Test doubles include", "type": "MC", "points": 1, "choices": ["Mocks, stubs, fakes", "Loops", "Classes", "Functions"], "answer": "Mocks, stubs, fakes" },
    { "_id": "Q6510-4-4", "quiz": "Q6510-4", "title": "Contract testing validates", "type": "MC", "points": 1, "choices": ["UI", "API agreements", "Database", "Performance"], "answer": "API agreements" },
    { "_id": "Q6510-4-5", "quiz": "Q6510-4", "title": "Mutation testing tests the tests", "type": "TF", "points": 1, "answer": "True" },

    // Q5 - CI/CD
    { "_id": "Q6510-5-1", "quiz": "Q6510-5", "title": "CI means", "type": "MC", "points": 1, "choices": ["Continuous Integration", "Container Images", "Cloud Infrastructure", "Code Inspection"], "answer": "Continuous Integration" },
    { "_id": "Q6510-5-2", "quiz": "Q6510-5", "title": "CD can mean delivery or deployment", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q6510-5-3", "quiz": "Q6510-5", "title": "Pipeline stages include", "type": "MC", "points": 1, "choices": ["Build, test, deploy", "Design only", "Code only", "Deploy only"], "answer": "Build, test, deploy" },
    { "_id": "Q6510-5-4", "quiz": "Q6510-5", "title": "Feature flags enable", "type": "MC", "points": 1, "choices": ["Gradual rollout", "Faster compile", "Less code", "No testing"], "answer": "Gradual rollout" },
    { "_id": "Q6510-5-5", "quiz": "Q6510-5", "title": "GitOps uses Git as source of truth", "type": "TF", "points": 1, "answer": "True" },

    // Q6 - Observability
    { "_id": "Q6510-6-1", "quiz": "Q6510-6", "title": "Three pillars of observability", "type": "MC", "points": 1, "choices": ["Logs, metrics, traces", "Code, tests, docs", "CPU, RAM, disk", "Users, sessions, pageviews"], "answer": "Logs, metrics, traces" },
    { "_id": "Q6510-6-2", "quiz": "Q6510-6", "title": "Distributed tracing tracks requests across services", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q6510-6-3", "quiz": "Q6510-6", "title": "SLI measures", "type": "MC", "points": 1, "choices": ["Service level indicator", "System login interface", "Software license info", "Server location ID"], "answer": "Service level indicator" },
    { "_id": "Q6510-6-4", "quiz": "Q6510-6", "title": "Alerting should be", "type": "MC", "points": 1, "choices": ["On everything", "Actionable", "Ignored", "Email only"], "answer": "Actionable" },
    { "_id": "Q6510-6-5", "quiz": "Q6510-6", "title": "APM stands for Application Performance Monitoring", "type": "TF", "points": 1, "answer": "True" },

    // Q7 - Security
    { "_id": "Q6510-7-1", "quiz": "Q6510-7", "title": "OWASP Top 10 includes", "type": "MC", "points": 1, "choices": ["Security vulnerabilities", "Programming languages", "Databases", "Cloud providers"], "answer": "Security vulnerabilities" },
    { "_id": "Q6510-7-2", "quiz": "Q6510-7", "title": "Zero trust means", "type": "MC", "points": 1, "choices": ["Trust nothing", "Never verify", "Always trust", "Trust but verify"], "answer": "Trust nothing" },
    { "_id": "Q6510-7-3", "quiz": "Q6510-7", "title": "SAST analyzes source code", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q6510-7-4", "quiz": "Q6510-7", "title": "Threat modeling technique", "type": "MC", "points": 1, "choices": ["STRIDE", "SOLID", "DRY", "KISS"], "answer": "STRIDE" },
    { "_id": "Q6510-7-5", "quiz": "Q6510-7", "title": "Principle of least privilege", "type": "TF", "points": 1, "answer": "True" },

    // Q8 - Performance
    { "_id": "Q6510-8-1", "quiz": "Q6510-8", "title": "Load testing simulates", "type": "MC", "points": 1, "choices": ["Multiple users", "Single user", "No users", "Infinite users"], "answer": "Multiple users" },
    { "_id": "Q6510-8-2", "quiz": "Q6510-8", "title": "Caching improves performance", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q6510-8-3", "quiz": "Q6510-8", "title": "Database query optimization", "type": "MC", "points": 1, "choices": ["Indexes and query plans", "More servers only", "Bigger tables", "No optimization"], "answer": "Indexes and query plans" },
    { "_id": "Q6510-8-4", "quiz": "Q6510-8", "title": "CDN stands for", "type": "MC", "points": 1, "choices": ["Content Delivery Network", "Central Data Node", "Cloud Database Network", "Cache Data Network"], "answer": "Content Delivery Network" },
    { "_id": "Q6510-8-5", "quiz": "Q6510-8", "title": "Profiling identifies bottlenecks", "type": "TF", "points": 1, "answer": "True" },

    // Q9 - Midterm
    { "_id": "Q6510-9-1", "quiz": "Q6510-9", "title": "Conway's Law", "type": "SA", "points": 3, "answer": "System design reflects organizational structure" },
    { "_id": "Q6510-9-2", "quiz": "Q6510-9", "title": "Technical debt", "type": "SA", "points": 3, "answer": "Future cost of shortcuts taken now" },
    { "_id": "Q6510-9-3", "quiz": "Q6510-9", "title": "Shift left means test early", "type": "TF", "points": 2, "answer": "True" },
    { "_id": "Q6510-9-4", "quiz": "Q6510-9", "title": "API-first design benefits", "type": "MC", "points": 2, "choices": ["Parallel development", "No documentation", "Slower development", "Monolith only"], "answer": "Parallel development" },

    // Q10 - Final
    { "_id": "Q6510-10-1", "quiz": "Q6510-10", "title": "Chaos engineering", "type": "SA", "points": 3, "answer": "Intentionally breaking systems to find weaknesses" },
    { "_id": "Q6510-10-2", "quiz": "Q6510-10", "title": "Service mesh handles", "type": "MC", "points": 2, "choices": ["Service-to-service communication", "UI only", "Database only", "File storage"], "answer": "Service-to-service communication" },
    { "_id": "Q6510-10-3", "quiz": "Q6510-10", "title": "Blue-green deployment", "type": "SA", "points": 3, "answer": "Two identical environments, switch traffic between them" },
    { "_id": "Q6510-10-4", "quiz": "Q6510-10", "title": "Platform engineering enables self-service", "type": "TF", "points": 2, "answer": "True" },

    // ==================== CS6620 Cloud Computing ====================

    // Q1 - Cloud Basics
    { "_id": "Q6620-1-1", "quiz": "Q6620-1", "title": "IaaS provides", "type": "MC", "points": 1, "choices": ["Applications", "Infrastructure", "Development tools", "Business processes"], "answer": "Infrastructure" },
    { "_id": "Q6620-1-2", "quiz": "Q6620-1", "title": "Public cloud shared by multiple organizations", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q6620-1-3", "quiz": "Q6620-1", "title": "Cloud elasticity means", "type": "MC", "points": 1, "choices": ["Fixed resources", "Auto-scaling", "Manual scaling", "No scaling"], "answer": "Auto-scaling" },
    { "_id": "Q6620-1-4", "quiz": "Q6620-1", "title": "Region contains", "type": "MC", "points": 1, "choices": ["Single datacenter", "Multiple availability zones", "Single server", "Countries"], "answer": "Multiple availability zones" },
    { "_id": "Q6620-1-5", "quiz": "Q6620-1", "title": "Serverless means no servers", "type": "TF", "points": 1, "answer": "False" },

    // Q2 - Docker & Images
    { "_id": "Q6620-2-1", "quiz": "Q6620-2", "title": "Dockerfile instruction to run commands", "type": "MC", "points": 1, "choices": ["RUN", "EXEC", "COMMAND", "DO"], "answer": "RUN" },
    { "_id": "Q6620-2-2", "quiz": "Q6620-2", "title": "Containers share kernel with host", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q6620-2-3", "quiz": "Q6620-2", "title": "Docker layers are", "type": "MC", "points": 1, "choices": ["Mutable", "Immutable", "Optional", "Temporary"], "answer": "Immutable" },
    { "_id": "Q6620-2-4", "quiz": "Q6620-2", "title": "Container vs VM", "type": "MC", "points": 1, "choices": ["Containers lighter", "VMs lighter", "Same weight", "Containers need more resources"], "answer": "Containers lighter" },
    { "_id": "Q6620-2-5", "quiz": "Q6620-2", "title": "Multi-stage builds reduce image size", "type": "TF", "points": 1, "answer": "True" },

    // Q3 - Kubernetes
    { "_id": "Q6620-3-1", "quiz": "Q6620-3", "title": "Kubernetes smallest unit", "type": "MC", "points": 1, "choices": ["Container", "Pod", "Node", "Cluster"], "answer": "Pod" },
    { "_id": "Q6620-3-2", "quiz": "Q6620-3", "title": "Service provides", "type": "MC", "points": 1, "choices": ["Storage", "Stable network endpoint", "Compute", "Monitoring"], "answer": "Stable network endpoint" },
    { "_id": "Q6620-3-3", "quiz": "Q6620-3", "title": "Deployment manages ReplicaSets", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q6620-3-4", "quiz": "Q6620-3", "title": "ConfigMap stores", "type": "MC", "points": 1, "choices": ["Secrets", "Configuration", "Code", "Logs"], "answer": "Configuration" },
    { "_id": "Q6620-3-5", "quiz": "Q6620-3", "title": "kubectl is", "type": "MC", "points": 1, "choices": ["Container runtime", "CLI tool", "Pod", "Service"], "answer": "CLI tool" },

    // Q4 - Storage
    { "_id": "Q6620-4-1", "quiz": "Q6620-4", "title": "Object storage best for", "type": "MC", "points": 1, "choices": ["Databases", "Unstructured data", "Operating systems", "Applications"], "answer": "Unstructured data" },
    { "_id": "Q6620-4-2", "quiz": "Q6620-4", "title": "Block storage provides raw storage", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q6620-4-3", "quiz": "Q6620-4", "title": "S3 storage classes", "type": "MC", "points": 1, "choices": ["Standard, IA, Glacier", "Fast, Slow", "Hot, Cold", "Primary, Secondary"], "answer": "Standard, IA, Glacier" },
    { "_id": "Q6620-4-4", "quiz": "Q6620-4", "title": "Persistent volumes outlive pods", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q6620-4-5", "quiz": "Q6620-4", "title": "CDN caches", "type": "MC", "points": 1, "choices": ["Compute", "Static content", "Databases", "Secrets"], "answer": "Static content" },

    // Q5 - Networking
    { "_id": "Q6620-5-1", "quiz": "Q6620-5", "title": "VPC stands for", "type": "MC", "points": 1, "choices": ["Virtual Private Cloud", "Virtual Public Cloud", "Very Private Cloud", "Virtual Provider Cloud"], "answer": "Virtual Private Cloud" },
    { "_id": "Q6620-5-2", "quiz": "Q6620-5", "title": "Subnets can span multiple AZs", "type": "TF", "points": 1, "answer": "False" },
    { "_id": "Q6620-5-3", "quiz": "Q6620-5", "title": "Load balancer types", "type": "MC", "points": 1, "choices": ["Application, Network, Classic", "Fast, Slow", "Internal only", "External only"], "answer": "Application, Network, Classic" },
    { "_id": "Q6620-5-4", "quiz": "Q6620-5", "title": "Security groups are", "type": "MC", "points": 1, "choices": ["Stateless", "Stateful", "Physical", "Optional"], "answer": "Stateful" },
    { "_id": "Q6620-5-5", "quiz": "Q6620-5", "title": "DNS resolves names to IPs", "type": "TF", "points": 1, "answer": "True" },

    // Q6 - IAM & Security
    { "_id": "Q6620-6-1", "quiz": "Q6620-6", "title": "IAM principle", "type": "MC", "points": 1, "choices": ["Grant everything", "Least privilege", "Maximum privilege", "No privilege"], "answer": "Least privilege" },
    { "_id": "Q6620-6-2", "quiz": "Q6620-6", "title": "MFA adds security layer", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q6620-6-3", "quiz": "Q6620-6", "title": "Roles vs Users", "type": "MC", "points": 1, "choices": ["Roles temporary, Users permanent", "Same thing", "Users temporary", "Roles for humans only"], "answer": "Roles temporary, Users permanent" },
    { "_id": "Q6620-6-4", "quiz": "Q6620-6", "title": "Policy document format", "type": "MC", "points": 1, "choices": ["XML", "JSON", "YAML", "Text"], "answer": "JSON" },
    { "_id": "Q6620-6-5", "quiz": "Q6620-6", "title": "Encryption at rest protects stored data", "type": "TF", "points": 1, "answer": "True" },

    // Q7 - Observability
    { "_id": "Q6620-7-1", "quiz": "Q6620-7", "title": "CloudWatch monitors", "type": "MC", "points": 1, "choices": ["AWS resources", "On-premise only", "Competitors", "Nothing"], "answer": "AWS resources" },
    { "_id": "Q6620-7-2", "quiz": "Q6620-7", "title": "Metrics are time-series data", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q6620-7-3", "quiz": "Q6620-7", "title": "Log aggregation tool", "type": "MC", "points": 1, "choices": ["ELK Stack", "Database", "CDN", "Load balancer"], "answer": "ELK Stack" },
    { "_id": "Q6620-7-4", "quiz": "Q6620-7", "title": "Distributed tracing tracks", "type": "MC", "points": 1, "choices": ["Single service", "Request across services", "Files", "Users"], "answer": "Request across services" },
    { "_id": "Q6620-7-5", "quiz": "Q6620-7", "title": "Prometheus pulls metrics", "type": "TF", "points": 1, "answer": "True" },

    // Q8 - IaC
    { "_id": "Q6620-8-1", "quiz": "Q6620-8", "title": "Terraform uses", "type": "MC", "points": 1, "choices": ["HCL", "JSON only", "Python", "Java"], "answer": "HCL" },
    { "_id": "Q6620-8-2", "quiz": "Q6620-8", "title": "IaC benefits include version control", "type": "TF", "points": 1, "answer": "True" },
    { "_id": "Q6620-8-3", "quiz": "Q6620-8", "title": "CloudFormation is", "type": "MC", "points": 1, "choices": ["AWS-specific", "Multi-cloud", "Google only", "Azure only"], "answer": "AWS-specific" },
    { "_id": "Q6620-8-4", "quiz": "Q6620-8", "title": "Idempotent means", "type": "MC", "points": 1, "choices": ["Run once", "Same result multiple runs", "Different each time", "Never runs"], "answer": "Same result multiple runs" },
    { "_id": "Q6620-8-5", "quiz": "Q6620-8", "title": "State file tracks infrastructure", "type": "TF", "points": 1, "answer": "True" },

    // Q9 - Midterm
    { "_id": "Q6620-9-1", "quiz": "Q6620-9", "title": "Cloud-native principles", "type": "SA", "points": 3, "answer": "Microservices, containers, DevOps, CI/CD" },
    { "_id": "Q6620-9-2", "quiz": "Q6620-9", "title": "12-factor app", "type": "SA", "points": 3, "answer": "Methodology for building scalable SaaS apps" },
    { "_id": "Q6620-9-3", "quiz": "Q6620-9", "title": "Service mesh examples", "type": "MC", "points": 2, "choices": ["Istio, Linkerd", "Docker, Kubernetes", "AWS, Azure", "MySQL, PostgreSQL"], "answer": "Istio, Linkerd" },
    { "_id": "Q6620-9-4", "quiz": "Q6620-9", "title": "Immutable infrastructure never changes", "type": "TF", "points": 2, "answer": "True" },

    // Q10 - Final
    { "_id": "Q6620-10-1", "quiz": "Q6620-10", "title": "FinOps manages", "type": "MC", "points": 2, "choices": ["Cloud costs", "Finance only", "Operations only", "Development"], "answer": "Cloud costs" },
    { "_id": "Q6620-10-2", "quiz": "Q6620-10", "title": "GitOps principles", "type": "SA", "points": 3, "answer": "Declarative, versioned, immutable, pulled automatically" },
    { "_id": "Q6620-10-3", "quiz": "Q6620-10", "title": "Zero-trust networking", "type": "SA", "points": 3, "answer": "Never trust, always verify, regardless of network location" },
    { "_id": "Q6620-10-4", "quiz": "Q6620-10", "title": "Compliance standards include SOC2", "type": "TF", "points": 2, "answer": "True" }
];

export { questionsSeed };