import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: process.env.DB_PASSWORD as string,
  database: "nature_horse",
  connectionLimit: 5,
  connectTimeout: 10000,
});

export const prisma = new PrismaClient({ adapter });
