/*
author: Paul Kim
date: November 13, 2023
version: 1.0
description: nested comment replies for CapySocial
 */

import express from "express"
const replies = express.Router()

import { createReply, updateReply } from "../controller"

replies.route('/').post(createReply)
replies.route('/:replyId').post(updateReply)

export default replies 