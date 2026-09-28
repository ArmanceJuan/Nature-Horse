import { ValidationError } from "../errors/http-errors.js";

export class Email {
  static readonly MAX_LENGTH = 100;
  private static readonly PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static isValid(raw: string): boolean {
    const candidate = raw.trim();

    return (
      candidate.length > 0 &&
      candidate.length <= Email.MAX_LENGTH &&
      Email.PATTERN.test(candidate)
    );
  }

  static of(raw: string): Email {
    if (!Email.isValid(raw)) {
      throw new ValidationError("A valid email is required");
    }

    return new Email(raw.trim().toLowerCase());
  }

  static tryOf(raw: string): Email | null {
    return Email.isValid(raw) ? new Email(raw.trim().toLowerCase()) : null;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
