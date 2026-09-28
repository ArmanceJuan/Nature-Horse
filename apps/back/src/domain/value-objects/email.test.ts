import { Email } from "./email.js";
import { ValidationError } from "../errors/http-errors.js";

describe("Email", () => {
  it("normalizes the address it is built from", () => {
    expect(Email.of("  Marie@Example.COM ").value).toBe("marie@example.com");
  });

  it("refuses an address that is not valid", () => {
    ["", "   ", "abc", "a@b", "a b@example.com", "@example.com"].forEach(
      (raw) => {
        expect(() => Email.of(raw)).toThrow(ValidationError);
      },
    );
  });

  it("accepts an address of the maximum length and refuses a longer one", () => {
    const local = "a".repeat(Email.MAX_LENGTH - "@example.com".length);

    expect(Email.isValid(`${local}@example.com`)).toBe(true);
    expect(Email.isValid(`a${local}@example.com`)).toBe(false);
  });

  it("returns nothing instead of failing when asked to try", () => {
    expect(Email.tryOf("not-an-email")).toBeNull();
    expect(Email.tryOf("Marie@Example.com")?.value).toBe("marie@example.com");
  });

  it("considers two addresses equal when they only differ by their case", () => {
    expect(
      Email.of("MARIE@example.com").equals(Email.of("marie@EXAMPLE.com")),
    ).toBe(true);
    expect(
      Email.of("marie@example.com").equals(Email.of("jean@example.com")),
    ).toBe(false);
  });

  it("converts to its normalized text", () => {
    expect(String(Email.of("Marie@Example.com"))).toBe("marie@example.com");
  });
});
