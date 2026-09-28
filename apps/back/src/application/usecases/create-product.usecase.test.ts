import { CreateProductUseCase } from "./create-product.usecase.js";
import { ValidationError } from "../../domain/errors/http-errors.js";
import { buildCategory } from "../../tests/builders/category.builder.js";
import { buildCreateProductInput } from "../../tests/builders/product.builder.js";
import { buildStore } from "../../tests/builders/store.builder.js";
import { InMemoryCategoryRepository } from "../../tests/fakes/in-memory-category.repository.js";
import { InMemoryProductRepository } from "../../tests/fakes/in-memory-product.repository.js";
import { InMemoryStoreRepository } from "../../tests/fakes/in-memory-store.repository.js";

const build = () => {
  const products = new InMemoryProductRepository();
  const useCase = new CreateProductUseCase(
    products,
    new InMemoryCategoryRepository([buildCategory({ id: "category-1" })]),
    new InMemoryStoreRepository([
      buildStore({ id: "store-1" }),
      buildStore({ id: "store-2" }),
    ]),
  );

  return { products, useCase };
};

describe("CreateProductUseCase", () => {
  it("creates the product and stores it", async () => {
    const { products, useCase } = build();

    const product = await useCase.execute(buildCreateProductInput());

    expect(product.slug).toBe("selle-monolith");
    expect(await products.findById("selle-monolith")).not.toBeNull();
  });

  it("rejects an unknown category", async () => {
    const { useCase } = build();

    await expect(
      useCase.execute(buildCreateProductInput({ categoryId: "unknown" })),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("rejects stock declared for an unknown store", async () => {
    const { useCase } = build();
    const input = buildCreateProductInput({
      variants: [
        {
          attributes: [{ attributeName: "Taille", value: "M" }],
          stockByStore: { "store-1": 1, ghost: 4 },
        },
      ],
    });

    await expect(useCase.execute(input)).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  it("rejects a product without any stock in any store", async () => {
    const { useCase } = build();
    const input = buildCreateProductInput({
      variants: [
        {
          attributes: [{ attributeName: "Taille", value: "M" }],
          stockByStore: { "store-1": 0, "store-2": 0 },
        },
      ],
    });

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      ValidationError,
    );
  });

  it("rejects two variants that share the same attributes", async () => {
    const { useCase } = build();
    const variant = {
      attributes: [
        { attributeName: "Taille", value: "M" },
        { attributeName: "Couleur", value: "Noir" },
      ],
      stockByStore: { "store-1": 1 },
    };
    const duplicated = {
      attributes: [
        { attributeName: "Couleur", value: "noir" },
        { attributeName: "Taille", value: "m" },
      ],
      stockByStore: { "store-2": 3 },
    };

    await expect(
      useCase.execute(
        buildCreateProductInput({ variants: [variant, duplicated] }),
      ),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("does not store anything when the input is refused", async () => {
    const { products, useCase } = build();

    await expect(
      useCase.execute(buildCreateProductInput({ categoryId: "unknown" })),
    ).rejects.toBeDefined();

    expect(await products.findAll({})).toEqual([]);
  });
});
