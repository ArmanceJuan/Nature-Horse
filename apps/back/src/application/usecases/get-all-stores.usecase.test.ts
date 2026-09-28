import { GetAllStoresUseCase } from "./get-all-stores.usecase.js";
import { buildStore } from "../../tests/builders/store.builder.js";
import { InMemoryStoreRepository } from "../../tests/fakes/in-memory-store.repository.js";

describe("GetAllStoresUseCase", () => {
  it("returns every store held by the repository", async () => {
    const stores = [
      buildStore({ id: "s1" }),
      buildStore({ id: "s2", city: "Aix-en-Provence" }),
    ];
    const useCase = new GetAllStoresUseCase(
      new InMemoryStoreRepository(stores),
    );

    expect(await useCase.execute()).toEqual(stores);
  });

  it("returns an empty list when there is no store", async () => {
    const useCase = new GetAllStoresUseCase(new InMemoryStoreRepository());

    expect(await useCase.execute()).toEqual([]);
  });
});
