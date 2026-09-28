import { AttributeValue } from "./product.entity.js";
import {
  buildProduct,
  buildVariant,
} from "../../tests/builders/product.builder.js";

describe("ProductVariant", () => {
  it("finds an attribute by its name", () => {
    const variant = buildVariant();

    expect(variant.attribute("Taille")).toBe("M");
    expect(variant.attribute("Matière")).toBeUndefined();
  });

  it("returns zero for a store without stock", () => {
    const variant = buildVariant({ stockByStore: { "store-1": 4 } });

    expect(variant.stockInStore("store-1")).toBe(4);
    expect(variant.stockInStore("store-2")).toBe(0);
  });

  it("returns a new variant when its stock changes and leaves the original untouched", () => {
    const variant = buildVariant({ stockByStore: { "store-1": 4 } });
    const updated = variant.withStock("store-2", 7);

    expect(updated.stockByStore).toEqual({ "store-1": 4, "store-2": 7 });
    expect(variant.stockByStore).toEqual({ "store-1": 4 });
  });
});

describe("Product", () => {
  it("adds up the stock of every variant in every store", () => {
    const product = buildProduct({
      variants: [
        buildVariant({
          id: "v1",
          stockByStore: { "store-1": 2, "store-2": 3 },
        }),
        buildVariant({ id: "v2", stockByStore: { "store-1": 1 } }),
      ],
    });

    expect(product.totalStock()).toBe(6);
  });

  it("is visible in the catalog when it is active and in stock", () => {
    expect(buildProduct().isVisibleInCatalog()).toBe(true);
  });

  it("is hidden from the catalog when it is archived", () => {
    expect(buildProduct({ status: "ARCHIVED" }).isVisibleInCatalog()).toBe(
      false,
    );
  });

  it("is hidden from the catalog when it is out of stock everywhere", () => {
    const product = buildProduct({
      variants: [
        buildVariant({ stockByStore: { "store-1": 0, "store-2": 0 } }),
      ],
    });

    expect(product.isVisibleInCatalog()).toBe(false);
  });

  it("matches a size carried by any of its variants", () => {
    const product = buildProduct({
      variants: [
        buildVariant({
          id: "v1",
          attributeValues: [
            new AttributeValue({ attributeName: "Taille", value: "S" }),
          ],
        }),
        buildVariant({
          id: "v2",
          attributeValues: [
            new AttributeValue({ attributeName: "Taille", value: "L" }),
          ],
        }),
      ],
    });

    expect(product.hasAnySize(["L", "XL"])).toBe(true);
    expect(product.hasAnySize(["XXL"])).toBe(false);
  });

  it("returns a new product with the requested status and leaves the original untouched", () => {
    const product = buildProduct({ status: "ACTIVE" });
    const archived = product.withStatus("ARCHIVED");

    expect(archived.status).toBe("ARCHIVED");
    expect(archived.id).toBe(product.id);
    expect(product.status).toBe("ACTIVE");
  });

  it("changes the stock of one variant only", () => {
    const product = buildProduct({
      variants: [
        buildVariant({ id: "v1", stockByStore: { "store-1": 2 } }),
        buildVariant({ id: "v2", stockByStore: { "store-1": 9 } }),
      ],
    });

    const updated = product.withVariantStock("v1", "store-1", 0);

    expect(updated.variants[0].stockInStore("store-1")).toBe(0);
    expect(updated.variants[1].stockInStore("store-1")).toBe(9);
  });

  it("serializes its data without exposing computed values", () => {
    const serialized = JSON.parse(JSON.stringify(buildProduct()));

    expect(serialized).toHaveProperty("slug", "test-product");
    expect(serialized).toHaveProperty("variants");
    expect(serialized).not.toHaveProperty("totalStock");
    expect(serialized).not.toHaveProperty("isVisibleInCatalog");
  });
});
