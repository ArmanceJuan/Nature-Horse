import type { ITrackingTokenGenerator } from "../../domain/interfaces/tracking-token-generator.interface.js";
import { TrackingToken } from "../../domain/value-objects/tracking-token.js";

export class FakeTrackingTokenGenerator implements ITrackingTokenGenerator {
  private counter = 0;

  generate(): TrackingToken {
    this.counter += 1;

    return TrackingToken.of(String(this.counter).padStart(64, "0"));
  }
}
