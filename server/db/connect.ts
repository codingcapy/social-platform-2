
/*
author: Paul Kim
date: December 8, 2023
version: 1.0
description: PrismaClient for CapySocial2
 */

import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient()