/*
author: Paul Kim
date: November 13, 2023
version: 1.0
description: post votes router for CapySocial
 */

import express from "express"
const router = express.Router()

import { createPostVote, updatePostVote } from "../controller"

router.route('/').post(createPostVote)
router.route('/:postVoteId').post(updatePostVote)

module.exports = router 