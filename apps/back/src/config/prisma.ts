import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

export const dbConfig = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: process.env.DB_PASSWORD as string,
  database: "nature_horse",
  connectionLimit: 5,
  connectTimeout: 10000,
  allowPublicKeyRetrieval: true, // A retirer en rpod
};

const adapter = new PrismaMariaDb(dbConfig);

export const prisma = new PrismaClient({ adapter });
