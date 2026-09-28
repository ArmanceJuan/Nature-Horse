import { RegisterValidator } from "./register.validator.js";
import { ValidationError } from "../../domain/errors/http-errors.js";

const validPayload = () => ({
  email: "  Marie@Example.com ",
  password: "Password1!",
  firstName: " Marie ",
  lastName: "Martin",
});

describe("RegisterValidator", () => {
  const validator = new RegisterValidator();

  it("accepts a complete payload and trims what must be", () => {
    const input = validator.parse(validPayload());

    expect(input.email).toBe("Marie@Example.com");
    expect(input.firstName).toBe("Marie");
    expect(input.lastName).toBe("Martin");
    expect(input).not.toHaveProperty("phone");
  });

  it("keeps a valid phone number, trimmed", () => {
    expect(
      validator.parse({ ...validPayload(), phone: " 06 12 34 56 78 " }).phone,
    ).toBe("06 12 34 56 78");
  });

  it("treats an empty phone number as absent", () => {
    expect(
      validator.parse({ ...validPayload(), phone: "" }),
    ).not.toHaveProperty("phone");
  });

  it("drops the fields it does not know, so nobody can register as an administrator", () => {
    const input = validator.parse({
      ...validPayload(),
      role: "ADMIN",
      otpEnabled: true,
      id: "forced",
    });

    expect(input).not.toHaveProperty("role");
    expect(input).not.toHaveProperty("otpEnabled");
    expect(input).not.toHaveProperty("id");
  });

  it("rejects an email that is not valid", () => {
    expect(() => validator.parse({ ...validPayload(), email: "nope" })).toThrow(
      "A valid email is required",
    );
  });

  it("rejects a password that is too weak", () => {
    ["password1!", "PASSWORD1!", "Password!!", "Password11", "Pa1!"].forEach(
      (password) => {
        expect(() => validator.parse({ ...validPayload(), password })).toThrow(
          "Password must be 8 to 72 characters long",
        );
      },
    );
  });

  it("accepts a password of 72 bytes and rejects one of 73", () => {
    expect(
      validator.parse({ ...validPayload(), password: `Aa1!${"a".repeat(68)}` })
        .password,
    ).toHaveLength(72);
    expect(() =>
      validator.parse({ ...validPayload(), password: `Aa1!${"a".repeat(69)}` }),
    ).toThrow(ValidationError);
  });

  it("counts the bytes of the password and not its characters", () => {
    expect(() =>
      validator.parse({ ...validPayload(), password: `Aa1!${"é".repeat(35)}` }),
    ).toThrow(ValidationError);
  });

  it("rejects a phone number that is not valid", () => {
    expect(() => validator.parse({ ...validPayload(), phone: "abc" })).toThrow(
      "Phone number is invalid",
    );
  });

  it("rejects missing names", () => {
    expect(() =>
      validator.parse({ ...validPayload(), firstName: "  " }),
    ).toThrow("First name is required");
    expect(() =>
      validator.parse({ ...validPayload(), lastName: undefined }),
    ).toThrow("Last name is required");
  });

  it("rejects a body that is not an object", () => {
    expect(() => validator.parse(null)).toThrow(ValidationError);
    expect(() => validator.parse("nope")).toThrow(ValidationError);
  });
});
