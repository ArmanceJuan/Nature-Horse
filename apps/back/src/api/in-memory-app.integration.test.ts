import request from "supertest";
import { createApp } from "./app.js";
import { buildInMemoryContainer } from "../tests/builders/in-memory-container.js";
import { buildCategory } from "../tests/builders/category.builder.js";
import {
  buildProduct,
  buildVariant,
} from "../tests/builders/product.builder.js";
import { buildStore } from "../tests/builders/store.builder.js";
import { buildUser } from "../tests/builders/user.builder.js";
import {
  AttributeValue,
  ProductCategory,
} from "../domain/entities/product.entity.js";
import { FakeGuards } from "../tests/fakes/fake-guards.js";

describe("createApp, without any database", () => {
  const category = buildCategory({
    id: "category-1",
    slug: "cavalier",
    name: "Cavalier",
  });
  const store = buildStore({ id: "store-1" });
  const product = buildProduct({
    id: "product-1",
    slug: "casquette",
    name: "Casquette",
    category: new ProductCategory(category),
    variants: [
      buildVariant({
        id: "variant-1",
        attributeValues: [
          new AttributeValue({ attributeName: "Taille", value: "Unique" }),
        ],
        stockByStore: { "store-1": 5 },
      }),
    ],
  });
  const admin = buildUser({ id: "admin-1", role: "ADMIN" });

  const app = request(
    createApp(
      buildInMemoryContainer({
        categories: [category],
        stores: [store],
        products: [product],
        users: [admin],
      }),
    ),
  );

  it("serves the catalog with no database at all", async () => {
    const response = await app.get("/api/products");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].slug).toBe("casquette");
  });

  it("serves a single product", async () => {
    const response = await app.get("/api/products/casquette");

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Casquette");
  });

  it("serves the categories and the stores", async () => {
    expect((await app.get("/api/categories")).body).toEqual([
      expect.objectContaining({ slug: "cavalier" }),
    ]);
    expect((await app.get("/api/stores")).body).toEqual([
      expect.objectContaining({ id: "store-1" }),
    ]);
  });

  it("lets a guest place an order and reduces the stock", async () => {
    const response = await app.post("/api/orders").send({
      storeId: "store-1",
      customer: {
        email: "marie@example.com",
        firstName: "Marie",
        lastName: "Martin",
      },
      items: [{ productVariantId: "variant-1", quantity: 2 }],
    });

    expect(response.status).toBe(201);
    expect(response.body.trackingToken).toBeDefined();

    const catalog = await app.get("/api/products/casquette");

    expect(catalog.body.variants[0].stockByStore["store-1"]).toBe(3);
  });

  it("protects the admin routes with the fake guards", async () => {
    const [header, value] = FakeGuards.headerFor(admin.id, admin.role);

    const asVisitor = await app.get("/api/orders");
    const asAdmin = await app.get("/api/orders").set(header, value);

    expect(asVisitor.status).toBe(401);
    expect(asAdmin.status).toBe(200);
  });
});
