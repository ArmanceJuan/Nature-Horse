import { LoginValidator } from "./login.validator.js";
import { ValidationError } from "../../domain/errors/http-errors.js";

describe("LoginValidator", () => {
  const validator = new LoginValidator();

  it("accepts an email and a password", () => {
    expect(
      validator.parse({ email: "marie@example.com", password: "Password1!" }),
    ).toEqual({
      email: "marie@example.com",
      password: "Password1!",
    });
  });

  it("keeps the password exactly as it was typed", () => {
    expect(
      validator.parse({ email: "marie@example.com", password: "  spaced  " })
        .password,
    ).toBe("  spaced  ");
  });

  it("keeps a code when there is one, trimmed", () => {
    expect(
      validator.parse({
        email: "marie@example.com",
        password: "x",
        code: " 123456 ",
      }).code,
    ).toBe("123456");
  });

  it("treats an empty code as absent", () => {
    expect(
      validator.parse({ email: "marie@example.com", password: "x", code: "" }),
    ).not.toHaveProperty("code");
  });

  it("drops the fields it does not know", () => {
    expect(
      validator.parse({
        email: "marie@example.com",
        password: "x",
        role: "ADMIN",
      }),
    ).not.toHaveProperty("role");
  });

  it("rejects a missing email or password", () => {
    expect(() => validator.parse({ password: "x" })).toThrow(
      "Email is required",
    );
    expect(() => validator.parse({ email: "marie@example.com" })).toThrow(
      "Password is required",
    );
  });

  it("rejects a password that is absurdly long", () => {
    expect(() =>
      validator.parse({
        email: "marie@example.com",
        password: "a".repeat(129),
      }),
    ).toThrow(ValidationError);
  });

  it("rejects a code that is not a short text", () => {
    expect(() =>
      validator.parse({
        email: "marie@example.com",
        password: "x",
        code: 123456,
      }),
    ).toThrow("Code must be a string");
    expect(() =>
      validator.parse({
        email: "marie@example.com",
        password: "x",
        code: "1".repeat(21),
      }),
    ).toThrow(ValidationError);
  });

  it("rejects a body that is not an object", () => {
    expect(() => validator.parse(undefined)).toThrow(ValidationError);
  });
});
