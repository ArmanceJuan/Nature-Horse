import crypto from "crypto";
import type { ITrackingTokenGenerator } from "../../domain/interfaces/tracking-token-generator.interface.js";
import { TrackingToken } from "../../domain/value-objects/tracking-token.js";

export class RandomTrackingTokenGenerator implements ITrackingTokenGenerator {
  generate(): TrackingToken {
    return TrackingToken.of(crypto.randomBytes(32).toString("hex"));
  }
}
