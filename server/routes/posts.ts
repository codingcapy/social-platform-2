/*
author: Paul Kim
date: November 13, 2023
version: 1.0
description: posts router for CapySocial
 */

import express from "express"
const posts = express.Router()

import { createPost, getPosts, getPost, updatePost } from "../controller"

posts.route('/').get(getPosts).post(createPost)
posts.route('/:postId').get(getPost).post(updatePost)

export default posts 