import request from "supertest";
import { app } from "./app.js";

describe("GET /api/products", () => {
  it("should return 200 and an array of products", async () => {
    const response = await request(app).get("/api/products");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should filter by collection", async () => {
    const response = await request(app).get(
      "/api/products?collection=haute-sellerie",
    );

    expect(response.status).toBe(200);
    expect(
      response.body.every(
        (p: { collection: string }) => p.collection === "haute-sellerie",
      ),
    ).toBe(true);
  });
});

describe("GET /api/products/:id", () => {
  it("should return 200 and the product for a valid id", async () => {
    const response = await request(app).get("/api/products/selle-monolith-1");

    expect(response.status).toBe(200);
    expect(response.body.id).toBe("selle-monolith-1");
    expect(response.body.variants.length).toBeGreaterThan(0);
  });

  it("should return 404 for an unknown id", async () => {
    const response = await request(app).get("/api/products/unknown-id");

    expect(response.status).toBe(404);
  });
});

describe("POST /api/products", () => {
  it("should return 401 when not authenticated", async () => {
    const response = await request(app)
      .post("/api/products")
      .send({ name: "Test" });

    expect(response.status).toBe(401);
  });
});
