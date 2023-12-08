
/*
author: Paul Kim
date: December 8, 2023
version: 1.0
description: replies router for CapySocial2
 */

import express from "express"
const replies = express.Router()

import { createReply, updateReply } from "../controller"

replies.route('/').post(createReply)
replies.route('/:replyId').post(updateReply)

export default replies 