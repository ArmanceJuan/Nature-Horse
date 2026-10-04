import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

export const dbConfig = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME || "nature_horse",
  connectionLimit: 5,
  connectTimeout: 10000,
  allowPublicKeyRetrieval: true,
};

const adapter = new PrismaMariaDb(dbConfig);

export const prisma = new PrismaClient({ adapter });
