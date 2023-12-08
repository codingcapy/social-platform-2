"use strict";
/*
author: Paul Kim
date: December 8, 2023
version: 1.0
description: web server for CapySocial2
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const users_1 = __importDefault(require("./routes/users"));
const user_1 = __importDefault(require("./routes/user"));
const posts_1 = __importDefault(require("./routes/posts"));
const comments_1 = __importDefault(require("./routes/comments"));
const replies_1 = __importDefault(require("./routes/replies"));
const postVotes_1 = __importDefault(require("./routes/postVotes"));
const commentVotes_1 = __importDefault(require("./routes/commentVotes"));
const replyVotes_1 = __importDefault(require("./routes/replyVotes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("welcome");
});
app.use("/api/users", users_1.default);
app.use("/api/user", user_1.default);
app.use("/api/posts", posts_1.default);
app.use("/api/comments", comments_1.default);
app.use("/api/postvotes", postVotes_1.default);
app.use("/api/commentvotes", commentVotes_1.default);
app.use("/api/replies", replies_1.default);
app.use("/api/replyvotes", replyVotes_1.default);
const cron = require('cron');
const https = require('https');
const backendUrl = "https://capysocial.onrender.com/";
const job = new cron.CronJob("*/14 * * * *", () => {
    console.log("restarting server");
    https.get(backendUrl, (res) => {
        if (res.statusCode === 200) {
            console.log('Server restarted');
        }
        else {
            console.log('failed to restart');
        }
    });
});
job.start();
app.listen(port, () => console.log(`Server listening on port: ${port}`));
