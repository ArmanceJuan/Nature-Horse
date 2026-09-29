import request from "supertest";
import { app } from "./server-app.js";

const UNKNOWN_TOKEN = "0".repeat(64);

const guest = {
  email: "marie@example.com",
  firstName: "Marie",
  lastName: "Martin",
};
const items = [{ productVariantId: "variant-1", quantity: 1 }];

describe("POST /api/orders", () => {
  it("refuses an order without any content", async () => {
    const response = await request(app).post("/api/orders").send({});

    expect(response.status).toBe(400);
  });

  it("asks a visitor for her details", async () => {
    const response = await request(app)
      .post("/api/orders")
      .send({ storeId: "isle-sur-la-sorgue", items });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Customer details are required to order without an account",
    );
  });

  it("refuses guest details with an invalid email", async () => {
    const response = await request(app)
      .post("/api/orders")
      .send({
        storeId: "isle-sur-la-sorgue",
        items,
        customer: { ...guest, email: "not-an-email" },
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("A valid email is required");
  });

  it("refuses an unknown store", async () => {
    const response = await request(app)
      .post("/api/orders")
      .send({ storeId: "unknown-store", items, customer: guest });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Store not found");
  });

  it("rejects an invalid session instead of treating the visitor as a guest", async () => {
    const response = await request(app)
      .post("/api/orders")
      .set("Cookie", "access_token=garbage")
      .send({ storeId: "isle-sur-la-sorgue", items, customer: guest });

    expect(response.status).toBe(401);
  });
});

describe("Order tracking by link", () => {
  it("does not reveal anything for a link that designates nothing", async () => {
    const response = await request(app).get(
      `/api/orders/track/${UNKNOWN_TOKEN}`,
    );

    expect(response.status).toBe(404);
  });

  it("answers the same way for a link that is not even well formed", async () => {
    const response = await request(app).get("/api/orders/track/not-a-token");

    expect(response.status).toBe(404);
  });

  it("cannot cancel through a link that designates nothing", async () => {
    const response = await request(app).post(
      `/api/orders/track/${UNKNOWN_TOKEN}/cancel`,
    );

    expect(response.status).toBe(404);
  });
});

describe("Protected order endpoints", () => {
  const cases: ["get" | "post" | "patch", string][] = [
    ["get", "/api/orders/me"],
    ["get", "/api/orders"],
    ["get", "/api/orders/some-id"],
    ["patch", "/api/orders/some-id/status"],
    ["post", "/api/orders/some-id/cancel"],
  ];

  it.each(cases)("refuses %s %s without a session", async (method, path) => {
    const response = await request(app)[method](path);

    expect(response.status).toBe(401);
  });
});
