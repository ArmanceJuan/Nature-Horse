import { prisma } from "../../config/prisma.js";
import { ICategoryRepository } from "../../domain/interfaces/category-repository.interface.js";

export const categoryPrismaRepository: ICategoryRepository = {
  findAll: async () => {
    const categories = await prisma.category.findMany({
      orderBy: { position: "asc" },
    });

    return categories.map(({ id, slug, name, position }) => ({
      id,
      slug,
      name,
      position,
    }));
  },
};
