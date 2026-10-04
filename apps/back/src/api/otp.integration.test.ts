import request from "supertest";
import { generateSecret, generate } from "otplib";
import { app } from "./server-app.js";
import { prisma } from "../config/prisma.js";

describe("OTP flow", () => {
  const testUser = {
    email: `otp-test-${Date.now()}@example.com`,
    password: "Passw0rd!",
    firstName: "OTP",
    lastName: "Tester",
  };

  let cookie: string;

  beforeAll(async () => {
    await request(app).post("/api/auth/register").send(testUser);

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password });

    cookie = loginResponse.headers["set-cookie"][0];
  });

  afterAll(async () => {
    await prisma.a2FBackupCode.deleteMany({
      where: { user: { email: testUser.email } },
    });
    await prisma.user.deleteMany({ where: { email: testUser.email } });
  });

  it("should generate a secret and QR code", async () => {
    const response = await request(app)
      .get("/api/otp/generate-secret")
      .set("Cookie", cookie);

    expect(response.status).toBe(200);
    expect(response.body.secret).toBeDefined();
    expect(response.body.qrCode).toContain("data:image/png;base64");
  });

  it("should reject enabling OTP with a wrong password", async () => {
    const secretResponse = await request(app)
      .get("/api/otp/generate-secret")
      .set("Cookie", cookie);

    const { secret } = secretResponse.body;
    const validCode = await generate({ secret });

    const response = await request(app)
      .post("/api/otp/enable")
      .set("Cookie", cookie)
      .send({ password: "WrongPassword1!", secret, code: validCode });

    expect(response.status).toBe(400);
  });

  it("should reject an invalid OTP code", async () => {
    const secretResponse = await request(app)
      .get("/api/otp/generate-secret")
      .set("Cookie", cookie);

    const { secret } = secretResponse.body;

    const response = await request(app)
      .post("/api/otp/enable")
      .set("Cookie", cookie)
      .send({ password: testUser.password, secret, code: "000000" });

    expect(response.status).toBe(400);
  });

  it("should enable OTP with the right password and a valid code", async () => {
    const secretResponse = await request(app)
      .get("/api/otp/generate-secret")
      .set("Cookie", cookie);

    const { secret } = secretResponse.body;
    const validCode = await generate({ secret });

    const enableResponse = await request(app)
      .post("/api/otp/enable")
      .set("Cookie", cookie)
      .send({ password: testUser.password, secret, code: validCode });

    expect(enableResponse.status).toBe(200);
    expect(enableResponse.body.backupCodes).toHaveLength(5);
  });

  it("should reject enabling a second time", async () => {
    const secretResponse = await request(app)
      .get("/api/otp/generate-secret")
      .set("Cookie", cookie);

    const { secret } = secretResponse.body;
    const validCode = await generate({ secret });

    const response = await request(app)
      .post("/api/otp/enable")
      .set("Cookie", cookie)
      .send({ password: testUser.password, secret, code: validCode });

    expect(response.status).toBe(409);
  });

  it("should reject disabling OTP with a wrong password, then disable with the right one, then reject a second attempt", async () => {
    const wrongPasswordResponse = await request(app)
      .post("/api/otp/disable")
      .set("Cookie", cookie)
      .send({ password: "WrongPassword1!" });

    expect(wrongPasswordResponse.status).toBe(400);

    const disableResponse = await request(app)
      .post("/api/otp/disable")
      .set("Cookie", cookie)
      .send({ password: testUser.password });

    expect(disableResponse.status).toBe(200);

    const secondDisableResponse = await request(app)
      .post("/api/otp/disable")
      .set("Cookie", cookie)
      .send({ password: testUser.password });

    expect(secondDisableResponse.status).toBe(409);
  });
});
