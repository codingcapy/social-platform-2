
import express from "express"
import cors from "cors"
import users from "./routes/users"
import user from "./routes/user"
import posts from "./routes/posts"
import comments from "./routes/comments"
import replies from "./routes/replies"
import postVotes from "./routes/postVotes"
import commentVotes from "./routes/commentVotes"

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
app.use("/api/postvotes", postVotes)
app.use("/api/commentvotes", commentVotes)
app.use("/api/replies", replies)

app.listen(port, () => console.log(`Server listening on port: ${port}`))