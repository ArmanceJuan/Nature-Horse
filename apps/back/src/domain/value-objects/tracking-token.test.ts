import { TrackingToken } from "./tracking-token.js";
import { ValidationError } from "../errors/http-errors.js";

const VALID = "a1b2c3d4".repeat(8);

describe("TrackingToken", () => {
  it("accepts 64 lowercase hexadecimal characters", () => {
    expect(TrackingToken.of(VALID).value).toBe(VALID);
  });

  it("refuses anything else", () => {
    [
      "",
      "abc",
      `${VALID}0`,
      VALID.slice(1),
      VALID.toUpperCase(),
      "g".repeat(64),
      ` ${VALID.slice(1)}`,
    ].forEach((raw) => {
      expect(() => TrackingToken.of(raw)).toThrow(ValidationError);
    });
  });

  it("returns nothing instead of failing when asked to try", () => {
    expect(TrackingToken.tryOf("not-a-token")).toBeNull();
    expect(TrackingToken.tryOf(VALID)?.value).toBe(VALID);
  });

  it("recognizes two identical tokens", () => {
    expect(TrackingToken.of(VALID).equals(TrackingToken.of(VALID))).toBe(true);
    expect(
      TrackingToken.of(VALID).equals(TrackingToken.of("0".repeat(64))),
    ).toBe(false);
  });

  it("converts to its text", () => {
    expect(String(TrackingToken.of(VALID))).toBe(VALID);
  });
});
