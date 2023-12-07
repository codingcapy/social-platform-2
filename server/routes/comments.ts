/*
author: Paul Kim
date: December 7, 2023
version: 1.0
description: comments router for CapySocial2
 */

import express from "express"
const comments = express.Router()

import { createComment, updateComment } from "../controller"

comments.route('/').post(createComment)
comments.route('/:commentId').post(updateComment)
comments.route('/delete/:commentId').post(updateComment)

export default comments 