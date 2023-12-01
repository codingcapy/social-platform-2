
import express from "express"
const user = express.Router()

import { validateUser, decryptToken } from "../controller"

user.route('/login').post(validateUser)
user.route('/validation').post(decryptToken)

export default user 