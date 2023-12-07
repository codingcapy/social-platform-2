
import express from "express"
import cors from "cors"
import users from "./routes/users"
import user from "./routes/user"
import posts from "./routes/posts"
import comments from "./routes/comments"

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("welcome")
})

app.use("/api/users", users)
app.use("/api/user", user)
app.use("/api/posts", posts)
app.use("/api/comments", comments)

app.listen(port, () => console.log(`Server listening on port: ${port}`))