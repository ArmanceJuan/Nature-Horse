import request from "supertest";
import { app } from "./server-app.js";

describe("POST /api/otp/disable", () => {
  it("refuses a request without a session", async () => {
    const response = await request(app)
      .post("/api/otp/disable")
      .send({ password: "Password1!" });

    expect(response.status).toBe(401);
  });
});
