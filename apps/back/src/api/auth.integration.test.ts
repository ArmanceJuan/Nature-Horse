import request from "supertest";
import { app } from "./app.js";

describe("Authentication endpoints", () => {
  it("refuses a login for an unknown account", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: "Password1!" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid credentials" });
    expect(response.headers["set-cookie"]).toBeUndefined();
  });

  it("answers the same way when the email is not even valid", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "not-an-email", password: "Password1!" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid credentials" });
  });

  it("refuses a login without credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({});

    expect(response.status).toBe(400);
  });

  it("refuses a registration with a weak password", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        email: "new@example.com",
        password: "weak",
        firstName: "New",
        lastName: "User",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Password must be");
  });

  it("refuses to describe the current user without a session", async () => {
    const response = await request(app).get("/api/auth/me");

    expect(response.status).toBe(401);
  });

  it("refuses to close a session that does not exist", async () => {
    const response = await request(app).post("/api/auth/logout");

    expect(response.status).toBe(401);
  });

  it("protects the two-factor endpoints", async () => {
    const generate = await request(app).get("/api/otp/generate-secret");
    const enable = await request(app)
      .post("/api/otp/enable")
      .send({ secret: "S", code: "123456" });

    expect(generate.status).toBe(401);
    expect(enable.status).toBe(401);
  });
});
