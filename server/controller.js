"use strict";
/*
author: Paul Kim
date: December 8, 2023
version: 1.0
description: controller for CapySocial2
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReplyVote = exports.createReplyVote = exports.updateCommentVote = exports.createCommentVote = exports.updatePostVote = exports.createPostVote = exports.updateReply = exports.createReply = exports.updateComment = exports.createComment = exports.updatePost = exports.getPost = exports.getPosts = exports.createPost = exports.updateUser = exports.getUser = exports.searchUserById = exports.decryptToken = exports.validateUser = exports.createUser = void 0;
const connect_1 = require("./db/connect");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 6;
;
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = req.body.username;
        const password = req.body.password;
        if (yield connect_1.db.user.findUnique({ where: { username: username } })) {
            res.json({ success: false, message: "Username already exists" });
        }
        else {
            const encrypted = yield bcrypt_1.default.hash(password, saltRounds);
            const user = yield connect_1.db.user.create({ data: { username: username, password: encrypted } });
            res.status(200).json({ success: true, message: "Sign up successful!" });
        }
    });
}
exports.createUser = createUser;
function validateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        const user = yield connect_1.db.user.findUnique({ where: { username: username } });
        if (!user)
            return res.json({ result: { user: null, token: null } });
        bcrypt_1.default.compare(password, (user === null || user === void 0 ? void 0 : user.password) || "", function (err, result) {
            if (result === true) {
                const token = jsonwebtoken_1.default.sign({ id: user === null || user === void 0 ? void 0 : user.id }, "secret", { expiresIn: "2days" });
                res.json({ result: { user, token } });
            }
            else {
                return res.json({ result: { user: null, token: null } });
            }
        });
    });
}
exports.validateUser = validateUser;
function decryptToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                res.status(403).send("Header does not exist");
                return "";
            }
            const token = authHeader.split(" ")[1];
            const decodedUser = jsonwebtoken_1.default.verify(token, "secret");
            const user = searchUserById(decodedUser.id);
            res.json({ result: { user, token } });
        }
        catch (err) {
            res.status(401).json({ err });
        }
    });
}
exports.decryptToken = decryptToken;
function searchUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield connect_1.db.user.findMany();
        const user = users.find((user) => user.id === id);
        // if (!user) throw new Error("User not found");
        return user;
    });
}
exports.searchUserById = searchUserById;
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.params.userId;
        const user = yield connect_1.db.user.findUnique({ where: { id: parseInt(userId) } });
        const userPosts = yield connect_1.db.post.findMany({ where: { username: user === null || user === void 0 ? void 0 : user.username } });
        const userComments = yield connect_1.db.comment.findMany({ where: { username: user === null || user === void 0 ? void 0 : user.username } });
        const userReplies = yield connect_1.db.reply.findMany({ where: { username: user === null || user === void 0 ? void 0 : user.username } });
        res.json({ user, userPosts, userComments, userReplies });
    });
}
exports.getUser = getUser;
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.params.userId;
        const incomingUser = yield req.body;
        const incomingPassword = incomingUser.password;
        const encrypted = yield bcrypt_1.default.hash(incomingPassword, saltRounds);
        const updatedUser = yield connect_1.db.user.update({
            where: { id: parseInt(userId) },
            data: { password: encrypted }
        });
        res.status(200).json({ success: true });
    });
}
exports.updateUser = updateUser;
function createPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const incomingPost = req.body;
        const post = yield connect_1.db.post.create({ data: { title: incomingPost.title, content: incomingPost.content, username: incomingPost.username } });
        res.status(200).json({ success: true });
    });
}
exports.createPost = createPost;
function getPosts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const posts = yield connect_1.db.post.findMany();
            const comments = yield connect_1.db.comment.findMany();
            const replies = yield connect_1.db.reply.findMany();
            const postVotes = yield connect_1.db.postVote.findMany();
            res.json({ posts, comments, replies, postVotes });
        }
        catch (err) {
            res.status(500).json({ msg: err });
        }
    });
}
exports.getPosts = getPosts;
function getPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const postId = req.params.postId;
        const post = yield connect_1.db.post.findUnique({ where: { id: parseInt(postId) } });
        const comments = yield connect_1.db.comment.findMany({ where: { postId: parseInt(postId) } });
        const replies = yield connect_1.db.reply.findMany({ where: { postId: parseInt(postId) } });
        const postVotes = yield connect_1.db.postVote.findMany({ where: { postId: parseInt(postId) } });
        const commentVotes = yield connect_1.db.commentVote.findMany({ where: { postId: parseInt(postId) } });
        const replyVotes = yield connect_1.db.replyVote.findMany({ where: { postId: parseInt(postId) } });
        res.json({ post, comments, replies, postVotes, commentVotes, replyVotes });
    });
}
exports.getPost = getPost;
function updatePost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const postId = parseInt(req.params.postId);
        const incomingPost = req.body;
        const updatedPost = yield connect_1.db.post.update({
            where: { id: postId },
            data: { title: incomingPost.title, content: incomingPost.content, edited: incomingPost.edited, deleted: incomingPost.deleted }
        });
        res.status(200).json({ success: true });
    });
}
exports.updatePost = updatePost;
function createComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const incomingComment = req.body;
        const comment = yield connect_1.db.comment.create({ data: { content: incomingComment.content, postId: incomingComment.postId, username: incomingComment.username } });
        res.status(200).json({ success: true });
    });
}
exports.createComment = createComment;
function updateComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const commentId = parseInt(req.params.commentId);
        const incomingComment = req.body;
        const updatedComment = yield connect_1.db.comment.update({
            where: { id: commentId },
            data: { content: incomingComment.content, edited: incomingComment.edited, deleted: incomingComment.deleted }
        });
        res.status(200).json({ success: true });
    });
}
exports.updateComment = updateComment;
function createReply(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const incomingReply = req.body;
        const reply = yield connect_1.db.reply.create({ data: { content: incomingReply.content, postId: incomingReply.postId, commentId: incomingReply.commentId, username: incomingReply.username } });
        res.status(200).json({ success: true });
    });
}
exports.createReply = createReply;
function updateReply(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const replyId = parseInt(req.params.replyId);
        const incomingReply = req.body;
        const updatedReply = yield connect_1.db.reply.update({
            where: { id: replyId },
            data: { content: incomingReply.content, edited: incomingReply.edited, deleted: incomingReply.deleted }
        });
        res.status(200).json({ success: true });
    });
}
exports.updateReply = updateReply;
function createPostVote(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const incomingVote = req.body;
        const postVote = yield connect_1.db.postVote.create({ data: { value: incomingVote.value, postId: incomingVote.postId, voterId: incomingVote.voterId } });
        res.status(200).json({ success: true });
    });
}
exports.createPostVote = createPostVote;
function updatePostVote(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const postVoteId = parseInt(req.params.postVoteId);
        const incomingPostVote = req.body;
        const updatedPostVote = yield connect_1.db.postVote.update({
            where: { id: postVoteId },
            data: { value: incomingPostVote.value }
        });
        res.status(200).json({ success: true });
    });
}
exports.updatePostVote = updatePostVote;
function createCommentVote(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const incomingVote = req.body;
        const commentVote = yield connect_1.db.commentVote.create({ data: { value: incomingVote.value, postId: incomingVote.postId, commentId: incomingVote.commentId, voterId: incomingVote.voterId } });
        res.status(200).json({ success: true });
    });
}
exports.createCommentVote = createCommentVote;
function updateCommentVote(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const commentVoteId = parseInt(req.params.commentVoteId);
        const incomingCommentVote = req.body;
        const updatedCommentVote = yield connect_1.db.commentVote.update({
            where: { id: commentVoteId },
            data: { value: incomingCommentVote.value }
        });
        res.status(200).json({ success: true });
    });
}
exports.updateCommentVote = updateCommentVote;
function createReplyVote(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const incomingVote = req.body;
        const replyVote = yield connect_1.db.replyVote.create({ data: { value: incomingVote.value, postId: incomingVote.postId, commentId: incomingVote.commentId, replyId: incomingVote.replyId, voterId: incomingVote.voterId } });
        res.status(200).json({ success: true });
    });
}
exports.createReplyVote = createReplyVote;
function updateReplyVote(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const replyVoteId = parseInt(req.params.replyVoteId);
        const incomingReplyVote = req.body;
        const updatedReplyVote = yield connect_1.db.replyVote.update({
            where: { id: replyVoteId },
            data: { value: incomingReplyVote.value }
        });
        res.status(200).json({ success: true });
    });
}
exports.updateReplyVote = updateReplyVote;
