/*
author: Paul Kim
date: November 13, 2023
version: 1.0
description: posts router for CapySocial
 */

import express from "express"
const posts = express.Router()

import { createPost, getPosts, getPost } from "../controller"

posts.route('/').get(getPosts).post(createPost)
posts.route('/:postId').get(getPost).post()
posts.route('/delete/:postId').post()

export default posts 