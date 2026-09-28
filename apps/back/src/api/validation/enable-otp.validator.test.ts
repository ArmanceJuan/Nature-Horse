import { EnableOtpValidator } from "./enable-otp.validator.js";
import { ValidationError } from "../../domain/errors/http-errors.js";

describe("EnableOtpValidator", () => {
  const validator = new EnableOtpValidator();

  it("accepts a secret and a code", () => {
    expect(
      validator.parse({ secret: "JBSWY3DPEHPK3PXP", code: "123456" }),
    ).toEqual({
      secret: "JBSWY3DPEHPK3PXP",
      code: "123456",
    });
  });

  it("drops the fields it does not know", () => {
    expect(
      validator.parse({ secret: "S", code: "1", userId: "forced" }),
    ).not.toHaveProperty("userId");
  });

  it("rejects a missing secret or code", () => {
    expect(() => validator.parse({ code: "123456" })).toThrow(
      "secret is required",
    );
    expect(() => validator.parse({ secret: "S" })).toThrow("code is required");
  });

  it("rejects values that are not text", () => {
    expect(() => validator.parse({ secret: 1, code: 2 })).toThrow(
      ValidationError,
    );
  });
});
