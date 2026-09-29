import request from "supertest";
import { app } from "./server-app.js";

describe("GET /api/users", () => {
  it("should return 401 when not authenticated", async () => {
    const response = await request(app).get("/api/users");

    expect(response.status).toBe(401);
  });
});
