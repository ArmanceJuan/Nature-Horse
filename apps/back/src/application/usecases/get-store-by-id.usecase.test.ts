import { getStoreByIdUsecase } from "./get-store-by-id.usecase.js";
import { IStoreRepository } from "../../domain/interfaces/store-repository.interface.js";
import { Store } from "../../domain/entities/store.entity.js";

describe("getStoreByIdUsecase", () => {
  const fakeStore: Store = {
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
  };

  it("should return the store when found", async () => {
    const fakeRepository: IStoreRepository = {
      findAll: async () => [],
      findById: async () => fakeStore,
    };

    const getStoreById = getStoreByIdUsecase(fakeRepository);
    const result = await getStoreById("1");

    expect(result).toEqual(fakeStore);
  });

  it("should throw 404 when store does not exist", async () => {
    const fakeRepository: IStoreRepository = {
      findAll: async () => [],
      findById: async () => null,
    };

    const getStoreById = getStoreByIdUsecase(fakeRepository);

    await expect(getStoreById("unknown")).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});
