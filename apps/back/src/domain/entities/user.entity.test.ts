import { buildUser } from "../../tests/builders/user.builder.js";

describe("User", () => {
  it("recognizes an administrator", () => {
    expect(buildUser({ role: "ADMIN" }).isAdmin()).toBe(true);
    expect(buildUser({ role: "STAFF" }).isAdmin()).toBe(false);
    expect(buildUser({ role: "CLIENT" }).isAdmin()).toBe(false);
  });

  it("checks whether it holds one of several roles", () => {
    const staff = buildUser({ role: "STAFF" });

    expect(staff.hasRole("ADMIN", "STAFF")).toBe(true);
    expect(staff.hasRole("ADMIN")).toBe(false);
  });

  it("builds its full name", () => {
    expect(
      buildUser({ firstName: "Marie", lastName: "Martin" }).fullName(),
    ).toBe("Marie Martin");
  });

  it("exposes only its public profile", () => {
    const profile = buildUser({
      otpEnabled: true,
      otpSecret: "SECRET",
    }).toPublic();

    expect(profile).not.toHaveProperty("password");
    expect(profile).not.toHaveProperty("otpSecret");
    expect(profile.otpEnabled).toBe(true);
  });

  it("cannot leak its password hash or its TOTP secret when it is serialized", () => {
    const serialized = JSON.stringify(buildUser({ otpSecret: "SECRET" }));

    expect(serialized).not.toContain("hashed:Password1!");
    expect(serialized).not.toContain("SECRET");
    expect(serialized).not.toContain("password");
    expect(serialized).not.toContain("otpSecret");
  });
});
