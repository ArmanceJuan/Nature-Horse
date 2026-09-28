import { GetProductByIdUseCase } from "./get-product-by-id.usecase.js";
import { NotFoundError } from "../../domain/errors/http-errors.js";
import {
  buildProduct,
  buildVariant,
} from "../../tests/builders/product.builder.js";
import { InMemoryProductRepository } from "../../tests/fakes/in-memory-product.repository.js";

describe("GetProductByIdUseCase", () => {
  const product = buildProduct({ id: "p1", slug: "selle" });

  it("finds an active product by its id", async () => {
    const useCase = new GetProductByIdUseCase(
      new InMemoryProductRepository([product]),
    );

    expect(await useCase.execute("p1")).toEqual(product);
  });

  it("finds an active product by its slug", async () => {
    const useCase = new GetProductByIdUseCase(
      new InMemoryProductRepository([product]),
    );

    expect(await useCase.execute("selle")).toEqual(product);
  });

  it("still returns an active product that is out of stock", async () => {
    const soldOut = buildProduct({
      id: "p2",
      slug: "epuise",
      variants: [buildVariant({ stockByStore: { "store-1": 0 } })],
    });
    const useCase = new GetProductByIdUseCase(
      new InMemoryProductRepository([soldOut]),
    );

    expect(await useCase.execute("epuise")).toEqual(soldOut);
  });

  it("throws a NotFoundError for an unknown product", async () => {
    const useCase = new GetProductByIdUseCase(
      new InMemoryProductRepository([product]),
    );

    await expect(useCase.execute("unknown")).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("hides an archived product", async () => {
    const archived = buildProduct({
      id: "p3",
      slug: "archive",
      status: "ARCHIVED",
    });
    const useCase = new GetProductByIdUseCase(
      new InMemoryProductRepository([archived]),
    );

    await expect(useCase.execute("archive")).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});
