"use strict";
/*
author: Paul Kim
date: December 8, 2023
version: 1.0
description: user router for CapySocial2
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user = express_1.default.Router();
const controller_1 = require("../controller");
user.route('/login').post(controller_1.validateUser);
user.route('/validation').post(controller_1.decryptToken);
exports.default = user;
