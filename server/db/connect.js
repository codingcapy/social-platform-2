"use strict";
/*
author: Paul Kim
date: December 8, 2023
version: 1.0
description: PrismaClient for CapySocial2
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const client_1 = require("@prisma/client");
exports.db = new client_1.PrismaClient();
