/*
author: Paul Kim
date: November 13, 2023
version: 1.0
description: post votes router for CapySocial
 */

import express from "express"
const postVotes = express.Router()

import { createPostVote, updatePostVote } from "../controller"

postVotes.route('/').post(createPostVote)
postVotes.route('/:postVoteId').post(updatePostVote)

export default postVotes 