import { EnableOtpValidator } from "./enable-otp.validator.js";
import { ValidationError } from "../../domain/errors/http-errors.js";

describe("EnableOtpValidator", () => {
  const validator = new EnableOtpValidator();

  it("accepts a password, a secret and a code", () => {
    expect(
      validator.parse({
        password: "Password1!",
        secret: "JBSWY3DPEHPK3PXP",
        code: "123456",
      }),
    ).toEqual({
      password: "Password1!",
      secret: "JBSWY3DPEHPK3PXP",
      code: "123456",
    });
  });

  it("does not trim the password", () => {
    expect(
      validator.parse({ password: "  spaced  ", secret: "S", code: "1" })
        .password,
    ).toBe("  spaced  ");
  });

  it("drops the fields it does not know", () => {
    expect(
      validator.parse({
        password: "p",
        secret: "S",
        code: "1",
        userId: "forced",
      }),
    ).not.toHaveProperty("userId");
  });

  it("rejects a missing password, secret or code", () => {
    expect(() => validator.parse({ secret: "S", code: "1" })).toThrow(
      "password is required",
    );
    expect(() => validator.parse({ password: "p", code: "1" })).toThrow(
      "secret is required",
    );
    expect(() => validator.parse({ password: "p", secret: "S" })).toThrow(
      "code is required",
    );
  });

  it("rejects a body that is not an object", () => {
    expect(() => validator.parse(null)).toThrow(ValidationError);
  });
});
