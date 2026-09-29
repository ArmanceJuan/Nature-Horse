import request from "supertest";
import { app } from "./server-app.js";

describe("Application security headers", () => {
  it("serves a public route with the security headers enabled", async () => {
    const response = await request(app).get("/api/stores");

    expect(response.status).toBe(200);
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["content-security-policy"]).toBeDefined();
    expect(response.headers["x-powered-by"]).toBeUndefined();
  });
});
