/*
author: Paul Kim
date: November 13, 2023
version: 1.0
description: comment votes commentVotes for CapySocial
 */

import express from "express"
const commentVotes = express.Router()

import { createCommentVote, updateCommentVote } from "../controller"

commentVotes.route('/').post(createCommentVote)
commentVotes.route('/:commentVoteId').post(updateCommentVote)

export default commentVotes 