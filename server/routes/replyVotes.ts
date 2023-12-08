/*
author: Paul Kim
date: November 13, 2023
version: 1.0
description: nested comment votes replyVotes for CapySocial
 */

import express from "express"
const replyVotes = express.Router()

import { createReplyVote, updateReplyVote } from "../controller"

replyVotes.route('/').post(createReplyVote)
replyVotes.route('/:replyVoteId').post(updateReplyVote)

export default replyVotes 