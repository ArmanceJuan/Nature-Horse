import { generate } from "otplib";
import { OtplibTotpService } from "./otplib-totp.service.js";

describe("OtplibTotpService", () => {
  const service = new OtplibTotpService();

  it("generates a different secret each time", () => {
    const first = service.generateSecret();
    const second = service.generateSecret();

    expect(first.length).toBeGreaterThan(10);
    expect(first).not.toBe(second);
  });

  it("accepts the code currently shown for the secret", async () => {
    const secret = service.generateSecret();
    const code = await generate({ secret });

    expect(await service.verify(secret, code)).toBe(true);
  });

  it("refuses a code that is not made of six digits, without asking the library", async () => {
    const secret = service.generateSecret();

    expect(await service.verify(secret, "abcdef")).toBe(false);
    expect(await service.verify(secret, "12345")).toBe(false);
    expect(await service.verify(secret, "1234567")).toBe(false);
    expect(await service.verify(secret, "")).toBe(false);
  });
});
