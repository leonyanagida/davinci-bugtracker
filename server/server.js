require("dotenv").config()
const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const rateLimit = require("express-rate-limit");
const db = require('./database/db')
const verifyToken = require("./auth/verifyToken")
const checkToken = require("./auth/checkToken")

// Create express app
const app = express()
app.disable("x-powered-by")

// Note: Must be placed before the backend routes
app.use(express.static(path.join(__dirname, "../client/build")));

// Mongo DB
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.use(cookieParser())
// Parses the JSON so the server can read it
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())

// Not the best way, but for now a rate limit to prevent spam
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50 // limit each IP to 50 requests per windowMs
})
// only apply to requests that begin with /api/
app.use("/api/", apiLimiter)

// Routes
const bugsRouter = require("./routes/bugs")
app.use("/app/bugs", verifyToken, bugsRouter)

const projectRouter = require("./routes/projects")
app.use("/app/projects", verifyToken, projectRouter)

const userCommentsRouter = require("./routes/usercomments")
app.use("/app/usercomments", verifyToken, userCommentsRouter)

const usersRouter = require("./routes/users")
app.use("/app/users", usersRouter)

// Default homepage
app.get("/api/checktoken", checkToken, (req, res, next) => {
    return res.status(200).send(req.user)
})

// Moved the app get client to the bottom of the express app
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "build/index.html"))
})

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', (req, res) => {
    res.status(404).send('404 This Page does not exist!')
})

const port = process.env.PORT || 4000
app.listen(port)
