
/*
author: Paul Kim
date: December 8, 2023
version: 1.0
description: replyVotes router for CapySocial2
 */

import express from "express"
const replyVotes = express.Router()

import { createReplyVote, updateReplyVote } from "../controller"

replyVotes.route('/').post(createReplyVote)
replyVotes.route('/:replyVoteId').post(updateReplyVote)

export default replyVotes 