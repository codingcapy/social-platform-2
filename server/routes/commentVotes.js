"use strict";
/*
author: Paul Kim
date: December 8, 2023
version: 1.0
description: comment votes router for CapySocial2
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentVotes = express_1.default.Router();
const controller_1 = require("../controller");
commentVotes.route('/').post(controller_1.createCommentVote);
commentVotes.route('/:commentVoteId').post(controller_1.updateCommentVote);
exports.default = commentVotes;
