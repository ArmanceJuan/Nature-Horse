import type { TrackingToken } from "../value-objects/tracking-token.js";

export interface ITrackingTokenGenerator {
  generate(): TrackingToken;
}
