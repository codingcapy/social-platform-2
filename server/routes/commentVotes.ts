
/*
author: Paul Kim
date: December 8, 2023
version: 1.0
description: comment votes router for CapySocial2
 */

import express from "express"
const commentVotes = express.Router()

import { createCommentVote, updateCommentVote } from "../controller"

commentVotes.route('/').post(createCommentVote)
commentVotes.route('/:commentVoteId').post(updateCommentVote)

export default commentVotes 