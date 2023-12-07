
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
    console.log(req.body)
    const user = await db.user.findUnique({ where: { username: username } }) as unknown as { id: number; username: string; password: string | undefined; date: Date } | null;
    console.log(user)
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