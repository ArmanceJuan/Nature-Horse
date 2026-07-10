import { prisma } from "../../config/prisma.js";
import { User } from "../../domain/entities/user.entity.js";
import { IUserRepository } from "../../domain/interfaces/user-repository.interface.js";

export const userPrismaRepository: IUserRepository = {
  findAll: async () => {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  findById: async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  findByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  create: async (data) => {
    return prisma.user.create({
      data,
    });
  },
};
