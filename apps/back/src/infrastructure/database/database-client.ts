import type { prisma } from "../../config/prisma.js";

export type DatabaseClient = typeof prisma;
