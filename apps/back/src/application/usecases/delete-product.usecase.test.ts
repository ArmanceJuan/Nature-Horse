import { DeleteProductUseCase } from "./delete-product.usecase.js";
import {
  ConflictError,
  NotFoundError,
} from "../../domain/errors/http-errors.js";
import { buildProduct } from "../../tests/builders/product.builder.js";
import { InMemoryProductRepository } from "../../tests/fakes/in-memory-product.repository.js";

describe("DeleteProductUseCase", () => {
  it("deletes a product that was never ordered", async () => {
    const repository = new InMemoryProductRepository([
      buildProduct({ id: "p1", slug: "selle" }),
    ]);
    const useCase = new DeleteProductUseCase(repository);

    await useCase.execute("selle");

    expect(repository.deletedIds).toEqual(["p1"]);
    expect(await repository.findById("p1")).toBeNull();
  });

  it("refuses to delete a product that has already been ordered", async () => {
    const repository = new InMemoryProductRepository(
      [buildProduct({ id: "p1" })],
      ["p1"],
    );
    const useCase = new DeleteProductUseCase(repository);

    await expect(useCase.execute("p1")).rejects.toBeInstanceOf(ConflictError);
    expect(repository.deletedIds).toEqual([]);
  });

  it("throws a NotFoundError for an unknown product", async () => {
    const useCase = new DeleteProductUseCase(new InMemoryProductRepository());

    await expect(useCase.execute("unknown")).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
