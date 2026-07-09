import { prisma } from "../config/prisma.js";

export const userRepository = {
  async findAll() {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  },
};
