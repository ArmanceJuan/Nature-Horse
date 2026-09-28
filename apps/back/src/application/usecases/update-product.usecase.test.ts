import { UpdateProductUseCase } from "./update-product.usecase.js";
import {
  NotFoundError,
  ValidationError,
} from "../../domain/errors/http-errors.js";
import { buildCategory } from "../../tests/builders/category.builder.js";
import { buildProduct } from "../../tests/builders/product.builder.js";
import { InMemoryCategoryRepository } from "../../tests/fakes/in-memory-category.repository.js";
import { InMemoryProductRepository } from "../../tests/fakes/in-memory-product.repository.js";

describe("UpdateProductUseCase", () => {
  const build = () => {
    const products = new InMemoryProductRepository([
      buildProduct({ id: "p1", slug: "selle", price: 100 }),
    ]);
    const categories = new InMemoryCategoryRepository([
      buildCategory({ id: "category-1" }),
    ]);

    return {
      products,
      useCase: new UpdateProductUseCase(products, categories),
    };
  };

  it("updates the product designated by its id", async () => {
    const { useCase } = build();

    const result = await useCase.execute("p1", { price: 75 });

    expect(result.price).toBe(75);
  });

  it("updates the product designated by its slug", async () => {
    const { products, useCase } = build();

    await useCase.execute("selle", { price: 60 });

    expect((await products.findById("p1"))?.price).toBe(60);
  });

  it("keeps the fields that are not part of the update", async () => {
    const { useCase } = build();

    const result = await useCase.execute("p1", { price: 75 });

    expect(result.name).toBe("Test Product");
  });

  it("throws a NotFoundError for an unknown product", async () => {
    const { useCase } = build();

    await expect(
      useCase.execute("unknown", { price: 75 }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("rejects an unknown category", async () => {
    const { useCase } = build();

    await expect(
      useCase.execute("p1", { categoryId: "unknown" }),
    ).rejects.toBeInstanceOf(ValidationError);
  });
});
