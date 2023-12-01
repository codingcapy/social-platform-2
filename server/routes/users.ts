

import express from "express"
const users = express.Router()

import { createUser } from "../controller"

users.route('/').post(createUser)

export default users 