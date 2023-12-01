
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
    bcrypt.compare(password, user?.password || "", function(err, result) {
        if (result === true){
            const token = jwt.sign({ id: user?.id }, "secret", { expiresIn: "2days" });
            res.json({ result: { user, token } });
        }
        else{
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