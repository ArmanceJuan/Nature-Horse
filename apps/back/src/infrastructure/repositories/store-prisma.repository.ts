import { prisma } from "../../config/prisma.js";
import { IStoreRepository } from "../../domain/interfaces/store-repository.interface.js";
import { Store } from "../../domain/entities/store.entity.js";

const toDomainStore = (raw: {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string | null;
  email: string | null;
  openingHours: unknown;
  createdAt: Date;
  updatedAt: Date;
}): Store => ({
  ...raw,
  openingHours: raw.openingHours as string[],
});

export const storePrismaRepository: IStoreRepository = {
  findAll: async () => {
    const stores = await prisma.store.findMany({ orderBy: { city: "asc" } });
    return stores.map(toDomainStore);
  },

  findById: async (id: string) => {
    const store = await prisma.store.findUnique({ where: { id } });
    return store ? toDomainStore(store) : null;
  },
};
