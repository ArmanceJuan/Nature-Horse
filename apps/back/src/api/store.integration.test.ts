import request from "supertest";
import { app } from "./server-app.js";

describe("GET /api/stores", () => {
  it("should return 200 and an array of stores", async () => {
    const response = await request(app).get("/api/stores");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
  });
});

describe("GET /api/stores/:id", () => {
  it("should return 200 and the store for a valid id", async () => {
    const response = await request(app).get("/api/stores/isle-sur-la-sorgue");

    expect(response.status).toBe(200);
    expect(response.body.city).toBe("Isle sur la Sorgue");
  });

  it("should return 404 for an unknown id", async () => {
    const response = await request(app).get("/api/stores/unknown-id");

    expect(response.status).toBe(404);
  });
});
