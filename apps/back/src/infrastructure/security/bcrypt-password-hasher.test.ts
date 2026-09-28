import { BcryptPasswordHasher } from "./bcrypt-password-hasher.js";

describe("BcryptPasswordHasher", () => {
  const hasher = new BcryptPasswordHasher(4);

  it("never returns the password it is given", async () => {
    expect(await hasher.hash("Password1!")).not.toBe("Password1!");
  });

  it("recognizes the password that was hashed", async () => {
    const hashed = await hasher.hash("Password1!");

    expect(await hasher.verify("Password1!", hashed)).toBe(true);
  });

  it("refuses any other password", async () => {
    const hashed = await hasher.hash("Password1!");

    expect(await hasher.verify("Password2!", hashed)).toBe(false);
  });

  it("gives a different hash each time for the same password", async () => {
    const first = await hasher.hash("Password1!");
    const second = await hasher.hash("Password1!");

    expect(first).not.toBe(second);
  });

  it("can simulate a verification without any real hash", async () => {
    await expect(
      hasher.simulateVerification("Password1!"),
    ).resolves.toBeUndefined();
  });
});
