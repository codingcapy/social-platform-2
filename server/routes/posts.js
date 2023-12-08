"use strict";
/*
author: Paul Kim
date: December 8, 2023
version: 1.0
description: posts router for CapySocial2
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const posts = express_1.default.Router();
const controller_1 = require("../controller");
posts.route('/').get(controller_1.getPosts).post(controller_1.createPost);
posts.route('/:postId').get(controller_1.getPost).post(controller_1.updatePost);
exports.default = posts;
