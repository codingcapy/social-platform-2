
/*
author: Paul Kim
date: December 8, 2023
version: 1.0
description: controller for CapySocial2
 */

import { Request, Response } from "express";
import { db } from "./db/connect";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
const saltRounds = 6

export interface IDecodedUser {
    id: number
};

export async function createUser(req: Request, res: Response) {
    const username = req.body.username;
    const password = req.body.password;
    if (await db.user.findUnique({ where: { username: username } })) {
        res.json({ success: false, message: "Username already exists" })
    }
    else {
        const encrypted = await bcrypt.hash(password, saltRounds)
        const user = await db.user.create({ data: { username: username, password: encrypted } })
        res.status(200).json({ success: true, message: "Sign up successful!" })
    }
}

export async function validateUser(req: Request, res: Response) {
    const { username, password } = req.body
    const user = await db.user.findUnique({ where: { username: username } }) as unknown as { id: number; username: string; password: string | undefined; date: Date } | null;
    if (!user) return res.json({ result: { user: null, token: null } });
    bcrypt.compare(password, user?.password || "", function (err, result) {
        if (result === true) {
            const token = jwt.sign({ id: user?.id }, "secret", { expiresIn: "2days" });
            res.json({ result: { user, token } });
        }
        else {
            return res.json({ result: { user: null, token: null } });
        }
    })

}

export async function decryptToken(req: Request, res: Response) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(403).send("Header does not exist");
            return "";
        }
        const token = authHeader.split(" ")[1];
        const decodedUser = jwt.verify(token, "secret");
        const user = searchUserById((decodedUser as IDecodedUser).id);
        res.json({ result: { user, token } });
    }
    catch (err) {
        res.status(401).json({ err });
    }
}

export async function searchUserById(id: number) {
    const users = await db.user.findMany()
    const user = users.find((user: any) => user.id === id);
    // if (!user) throw new Error("User not found");
    return user;
}

export async function getUser(req: Request, res: Response) {
    const userId = req.params.userId;
    const user = await db.user.findUnique({ where: { id: parseInt(userId) } })
    const userPosts = await db.post.findMany({ where: { username: user?.username } })
    const userComments = await db.comment.findMany({ where: { username: user?.username } })
    const userReplies = await db.reply.findMany({ where: { username: user?.username } })
    res.json({ user, userPosts, userComments, userReplies });
}

export async function updateUser(req: Request, res: Response) {
    const userId = req.params.userId
    const incomingUser = await req.body;
    const incomingPassword = incomingUser.password
    const encrypted = await bcrypt.hash(incomingPassword, saltRounds)
    const updatedUser = await db.user.update(
        {
            where: { id: parseInt(userId) },
            data: { password: encrypted }
        }
    );
    res.status(200).json({ success: true });
}

export async function createPost(req: Request, res: Response) {
    const incomingPost = req.body
    const post = await db.post.create({ data: { title: incomingPost.title, content: incomingPost.content, username: incomingPost.username } })
    res.status(200).json({ success: true })
}

export async function getPosts(req: Request, res: Response) {
    try {
        const posts = await db.post.findMany()
        const comments = await db.comment.findMany()
        const replies = await db.reply.findMany()
        const postVotes = await db.postVote.findMany()
        res.json({ posts, comments, replies, postVotes });
    }
    catch (err) {
        res.status(500).json({ msg: err })
    }
}

export async function getPost(req: Request, res: Response) {
    const postId = req.params.postId;
    const post = await db.post.findUnique({ where: { id: parseInt(postId) } })
    const comments = await db.comment.findMany({ where: { postId: parseInt(postId) } })
    const replies = await db.reply.findMany({ where: { postId: parseInt(postId) } })
    const postVotes = await db.postVote.findMany({ where: { postId: parseInt(postId) } })
    const commentVotes = await db.commentVote.findMany({ where: { postId: parseInt(postId) } })
    const replyVotes = await db.replyVote.findMany({ where: { postId: parseInt(postId) } })
    res.json({ post, comments, replies, postVotes, commentVotes, replyVotes });
}

export async function updatePost(req: Request, res: Response) {
    const postId = parseInt(req.params.postId)
    const incomingPost = req.body;
    const updatedPost = await db.post.update(
        {
            where: { id: postId },
            data: { title: incomingPost.title, content: incomingPost.content, edited: incomingPost.edited, deleted: incomingPost.deleted }
        });
    res.status(200).json({ success: true });
}

export async function createComment(req: Request, res: Response) {
    const incomingComment = req.body
    const comment = await db.comment.create({ data: { content: incomingComment.content, postId: incomingComment.postId, username: incomingComment.username } })
    res.status(200).json({ success: true })
}

export async function updateComment(req: Request, res: Response) {
    const commentId = parseInt(req.params.commentId)
    const incomingComment = req.body;
    const updatedComment = await db.comment.update(
        {
            where: { id: commentId },
            data: { content: incomingComment.content, edited: incomingComment.edited, deleted: incomingComment.deleted }
        }
    );
    res.status(200).json({ success: true });
}

export async function createReply(req: Request, res: Response) {
    const incomingReply = req.body
    const reply = await db.reply.create({ data: { content: incomingReply.content, postId: incomingReply.postId, commentId: incomingReply.commentId, username: incomingReply.username } })
    res.status(200).json({ success: true })
}

export async function updateReply(req: Request, res: Response) {
    const replyId = parseInt(req.params.replyId)
    const incomingReply = req.body;
    const updatedReply = await db.reply.update(
        {
            where: { id: replyId },
            data: { content: incomingReply.content, edited: incomingReply.edited, deleted: incomingReply.deleted }
        }
    );
    res.status(200).json({ success: true });
}

export async function createPostVote(req: Request, res: Response) {
    const incomingVote = req.body
    const postVote = await db.postVote.create({ data: { value: incomingVote.value, postId: incomingVote.postId, voterId: incomingVote.voterId } })
    res.status(200).json({ success: true })
}

export async function updatePostVote(req: Request, res: Response) {
    const postVoteId = parseInt(req.params.postVoteId)
    const incomingPostVote = req.body;
    const updatedPostVote = await db.postVote.update(
        {
            where: { id: postVoteId },
            data: { value: incomingPostVote.value }
        }
    );
    res.status(200).json({ success: true });
}

export async function createCommentVote(req: Request, res: Response) {
    const incomingVote = req.body
    const commentVote = await db.commentVote.create({ data: { value: incomingVote.value, postId: incomingVote.postId, commentId: incomingVote.commentId, voterId: incomingVote.voterId } })
    res.status(200).json({ success: true })
}

export async function updateCommentVote(req: Request, res: Response) {
    const commentVoteId = parseInt(req.params.commentVoteId)
    const incomingCommentVote = req.body;
    const updatedCommentVote = await db.commentVote.update(
        {
            where: { id: commentVoteId },
            data: { value: incomingCommentVote.value }
        }
    );
    res.status(200).json({ success: true });
}

export async function createReplyVote(req: Request, res: Response) {
    const incomingVote = req.body
    const replyVote = await db.replyVote.create({ data: { value: incomingVote.value, postId: incomingVote.postId, commentId: incomingVote.commentId, replyId: incomingVote.replyId, voterId: incomingVote.voterId } })
    res.status(200).json({ success: true })
}

export async function updateReplyVote(req: Request, res: Response) {
    const replyVoteId = parseInt(req.params.replyVoteId)
    const incomingReplyVote = req.body;
    const updatedReplyVote = await db.replyVote.update(
        {
            where: { id: replyVoteId },
            data: { value: incomingReplyVote.value }
        }
    );
    res.status(200).json({ success: true });
}