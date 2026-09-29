import { RandomTrackingTokenGenerator } from "./random-tracking-token.generator.js";
import { TrackingToken } from "../../domain/value-objects/tracking-token.js";

describe("RandomTrackingTokenGenerator", () => {
  const generator = new RandomTrackingTokenGenerator();

  it("generates tokens that the domain accepts", () => {
    const token = generator.generate();

    expect(token).toBeInstanceOf(TrackingToken);
    expect(token.value).toMatch(/^[0-9a-f]{64}$/);
  });

  it("never generates the same token twice", () => {
    const tokens = Array.from(
      { length: 100 },
      () => generator.generate().value,
    );

    expect(new Set(tokens).size).toBe(100);
  });
});
