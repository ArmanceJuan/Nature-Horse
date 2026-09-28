import { ArchiveProductUseCase } from "./archive-product.usecase.js";
import { ReactivateProductUseCase } from "./reactivate-product.usecase.js";
import { NotFoundError } from "../../domain/errors/http-errors.js";
import { buildProduct } from "../../tests/builders/product.builder.js";
import { InMemoryProductRepository } from "../../tests/fakes/in-memory-product.repository.js";

describe("ArchiveProductUseCase", () => {
  it("archives an active product", async () => {
    const repository = new InMemoryProductRepository([
      buildProduct({ id: "p1", status: "ACTIVE" }),
    ]);
    const useCase = new ArchiveProductUseCase(repository);

    const result = await useCase.execute("p1");

    expect(result.status).toBe("ARCHIVED");
    expect((await repository.findById("p1"))?.status).toBe("ARCHIVED");
  });

  it("leaves an already archived product as it is", async () => {
    const repository = new InMemoryProductRepository([
      buildProduct({ id: "p1", status: "ARCHIVED" }),
    ]);
    const useCase = new ArchiveProductUseCase(repository);

    expect((await useCase.execute("p1")).status).toBe("ARCHIVED");
  });

  it("throws a NotFoundError for an unknown product", async () => {
    const useCase = new ArchiveProductUseCase(new InMemoryProductRepository());

    await expect(useCase.execute("unknown")).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});

describe("ReactivateProductUseCase", () => {
  it("reactivates an archived product", async () => {
    const repository = new InMemoryProductRepository([
      buildProduct({ id: "p1", status: "ARCHIVED" }),
    ]);
    const useCase = new ReactivateProductUseCase(repository);

    const result = await useCase.execute("p1");

    expect(result.status).toBe("ACTIVE");
  });

  it("throws a NotFoundError for an unknown product", async () => {
    const useCase = new ReactivateProductUseCase(
      new InMemoryProductRepository(),
    );

    await expect(useCase.execute("unknown")).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
