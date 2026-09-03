import request from "supertest";
import { app } from "./app.js";

describe("POST /api/orders", () => {
  it("should return 401 when not authenticated", async () => {
    const response = await request(app)
      .post("/api/orders")
      .send({
        storeId: "isle-sur-la-sorgue",
        items: [{ productVariantId: "x", quantity: 1 }],
      });

    expect(response.status).toBe(401);
  });
});

describe("GET /api/orders", () => {
  it("should return 401 when not authenticated", async () => {
    const response = await request(app).get("/api/orders");

    expect(response.status).toBe(401);
  });
});
