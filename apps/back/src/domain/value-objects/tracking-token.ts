import { ValidationError } from "../errors/http-errors.js";

export class TrackingToken {
  private static readonly PATTERN = /^[0-9a-f]{64}$/;

  readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static isValid(raw: string): boolean {
    return TrackingToken.PATTERN.test(raw);
  }

  static of(raw: string): TrackingToken {
    if (!TrackingToken.isValid(raw)) {
      throw new ValidationError("Invalid tracking token");
    }

    return new TrackingToken(raw);
  }

  static tryOf(raw: string): TrackingToken | null {
    return TrackingToken.isValid(raw) ? new TrackingToken(raw) : null;
  }

  equals(other: TrackingToken): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
