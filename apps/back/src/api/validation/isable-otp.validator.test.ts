import { DisableOtpValidator } from "./disable-otp.validator.js";
import { ValidationError } from "../../domain/errors/http-errors.js";

describe("DisableOtpValidator", () => {
  const validator = new DisableOtpValidator();

  it("accepts a password", () => {
    expect(validator.parse({ password: "Password1!" })).toEqual({
      password: "Password1!",
    });
  });

  it("does not trim the password", () => {
    expect(validator.parse({ password: "  spaced  " }).password).toBe(
      "  spaced  ",
    );
  });

  it("drops the fields it does not know", () => {
    expect(validator.parse({ password: "p", userId: "forced" })).toEqual({
      password: "p",
    });
  });

  it("rejects a missing password", () => {
    expect(() => validator.parse({})).toThrow("password is required");
  });

  it("rejects a body that is not an object", () => {
    expect(() => validator.parse(undefined)).toThrow(ValidationError);
  });
});
