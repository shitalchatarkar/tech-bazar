const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
// const { adminProtected, userProtected } = require("./middlewares/auth.middleware")
require("dotenv").config()

const path = require("path")
const { adminMIddleware } = require("./middleware/admin.middleware")
const { usermiddleware } = require("./middleware/user.middleware")

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: "http://localhost:5173", credentials: true }))

app.use(express.static("dist"))

app.use("/api/auth", require("./routes/auth.routes"))
app.use("/api/public", require("./routes/product.routes"))

app.use("/api/admin", adminMIddleware, require("./routes/admin.routes"))
app.use("/api/user", usermiddleware, require("./routes/user.routes"))

app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.url);

    // res.sendFile(path.join(__dirname, "dist", "index.html"))
    res.status(404).json({ message: "Route not found" })
})
app.use((err, req, res, next) => {
    console.error(err)
    res.status(err.status || 500).json({ message: "Internal Server Error" })
})
mongoose.connect(process.env.MONGO_URL)
mongoose.connection.once("open", () => {
    console.log("mongo connected")
    app.listen(process.env.PORT, console.log("server running"))
})