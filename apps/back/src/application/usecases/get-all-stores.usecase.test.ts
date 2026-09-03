import { getAllStoresUsecase } from "./get-all-stores.usecase.js";
import { IStoreRepository } from "../../domain/interfaces/store-repository.interface.js";
import { Store } from "../../domain/entities/store.entity.js";

describe("getAllStoresUsecase", () => {
  const fakeStores: Store[] = [
    {
      id: "1",
      name: "Test Store",
      address: "1 rue Test",
      postalCode: "75000",
      city: "Paris",
      phone: null,
      email: null,
      openingHours: ["Lun-Ven: 9h-18h"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  it("should return all stores from the repository", async () => {
    const fakeRepository: IStoreRepository = {
      findAll: async () => fakeStores,
      findById: async () => null,
    };

    const getAllStores = getAllStoresUsecase(fakeRepository);
    const result = await getAllStores();

    expect(result).toEqual(fakeStores);
  });
});
