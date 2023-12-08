"use strict";
/*
author: Paul Kim
date: December 8, 2023
version: 1.0
description: users router for CapySocial2
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users = express_1.default.Router();
const controller_1 = require("../controller");
users.route('/').post(controller_1.createUser);
users.route('/:userId').get(controller_1.getUser).post(controller_1.updateUser);
exports.default = users;
