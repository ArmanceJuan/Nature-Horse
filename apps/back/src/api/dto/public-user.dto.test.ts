import { toPublicUser } from "./public-user.dto.js";

describe("toPublicUser", () => {
  const rawUser = {
    id: "u1",
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "Test",
    phone: null,
    role: "ADMIN",
    otp_enable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    password: "hashed-password",
    otp_secret: "TOTP-SECRET",
  };

  it("keeps the profile fields", () => {
    const result = toPublicUser(rawUser);

    expect(result).toMatchObject({
      id: "u1",
      email: "admin@example.com",
      role: "ADMIN",
      otp_enable: true,
    });
  });

  it("never exposes the password hash or the TOTP secret", () => {
    const result = toPublicUser(rawUser);

    expect(result).not.toHaveProperty("password");
    expect(result).not.toHaveProperty("otp_secret");
  });
});
