import { GetStoreByIdUseCase } from "./get-store-by-id.usecase.js";
import { NotFoundError } from "../../domain/errors/http-errors.js";
import { buildStore } from "../../tests/builders/store.builder.js";
import { InMemoryStoreRepository } from "../../tests/fakes/in-memory-store.repository.js";

describe("GetStoreByIdUseCase", () => {
  const store = buildStore({ id: "s1" });
  const useCase = new GetStoreByIdUseCase(new InMemoryStoreRepository([store]));

  it("returns the store when it exists", async () => {
    expect(await useCase.execute("s1")).toEqual(store);
  });

  it("throws a NotFoundError when the store does not exist", async () => {
    await expect(useCase.execute("unknown")).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("carries the 404 status of the error", async () => {
    await expect(useCase.execute("unknown")).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});
