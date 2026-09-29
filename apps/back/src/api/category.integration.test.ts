import request from "supertest";
import { app } from "./server-app.js";

describe("GET /api/categories", () => {
  it("returns the categories in display order", async () => {
    const response = await request(app).get("/api/categories");
    const slugs = response.body.map(
      (category: { slug: string }) => category.slug,
    );

    expect(response.status).toBe(200);
    expect(slugs.slice(0, 5)).toEqual([
      "cavalier",
      "cheval",
      "ecurie",
      "soin",
      "chiens-chats",
    ]);
  });
});

describe("GET /api/products with a category filter", () => {
  it("returns only the products of the requested category", async () => {
    const response = await request(app).get("/api/products?category=soin");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(
      response.body.every(
        (product: { category: { slug: string } | null }) =>
          product.category?.slug === "soin",
      ),
    ).toBe(true);
  });

  it("returns only new products when isNew is true", async () => {
    const response = await request(app).get("/api/products?isNew=true");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(
      response.body.every(
        (product: { isNew: boolean }) => product.isNew === true,
      ),
    ).toBe(true);
  });
});
