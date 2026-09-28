import { AdjustStockUseCase } from "./adjust-stock.usecase.js";
import {
  NotFoundError,
  ValidationError,
} from "../../domain/errors/http-errors.js";
import {
  buildProduct,
  buildVariant,
} from "../../tests/builders/product.builder.js";
import { buildStore } from "../../tests/builders/store.builder.js";
import { InMemoryProductRepository } from "../../tests/fakes/in-memory-product.repository.js";
import { InMemoryStoreRepository } from "../../tests/fakes/in-memory-store.repository.js";

const build = () => {
  const products = new InMemoryProductRepository([
    buildProduct({
      id: "p1",
      variants: [buildVariant({ id: "v1", stockByStore: { "store-1": 1 } })],
    }),
  ]);
  const useCase = new AdjustStockUseCase(
    products,
    new InMemoryStoreRepository([buildStore({ id: "store-1" })]),
  );

  return { products, useCase };
};

describe("AdjustStockUseCase", () => {
  it("sets the stock of a variant in a store", async () => {
    const { products, useCase } = build();

    const result = await useCase.execute("v1", {
      storeId: "store-1",
      quantity: 12,
    });

    expect(result.variants[0].stockInStore("store-1")).toBe(12);
    expect(
      (await products.findById("p1"))?.variants[0].stockInStore("store-1"),
    ).toBe(12);
  });

  it("accepts a stock of zero", async () => {
    const { useCase } = build();

    const result = await useCase.execute("v1", {
      storeId: "store-1",
      quantity: 0,
    });

    expect(result.variants[0].stockInStore("store-1")).toBe(0);
  });

  it("rejects a negative quantity", async () => {
    const { useCase } = build();

    await expect(
      useCase.execute("v1", { storeId: "store-1", quantity: -1 }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("rejects a quantity that is not an integer", async () => {
    const { useCase } = build();

    await expect(
      useCase.execute("v1", { storeId: "store-1", quantity: 2.5 }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("throws a NotFoundError for an unknown variant", async () => {
    const { useCase } = build();

    await expect(
      useCase.execute("ghost", { storeId: "store-1", quantity: 3 }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("throws a NotFoundError for an unknown store", async () => {
    const { useCase } = build();

    await expect(
      useCase.execute("v1", { storeId: "ghost", quantity: 3 }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
