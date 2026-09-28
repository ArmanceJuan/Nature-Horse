import { ValidationError } from "../../domain/errors/http-errors.js";

export interface IValidator<T> {
  parse(data: unknown): T;
}

export abstract class Validator<T> implements IValidator<T> {
  parse(data: unknown): T {
    if (!this.isRecord(data)) {
      throw new ValidationError("Invalid request body");
    }

    const errors: string[] = [];
    const value = this.build(data, errors);

    if (errors.length > 0) {
      throw new ValidationError(errors.join(", "));
    }

    return value;
  }

  protected abstract build(body: Record<string, unknown>, errors: string[]): T;

  protected isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  protected isText(value: unknown, maxLength: number): value is string {
    return (
      typeof value === "string" &&
      value.trim().length > 0 &&
      value.trim().length <= maxLength
    );
  }

  protected has(body: Record<string, unknown>, key: string): boolean {
    return body[key] !== undefined;
  }

  protected text(
    body: Record<string, unknown>,
    key: string,
    message: string,
    errors: string[],
    maxLength: number,
  ): string {
    const value = body[key];

    if (!this.isText(value, maxLength)) {
      errors.push(message);
      return "";
    }

    return value.trim();
  }

  protected price(
    body: Record<string, unknown>,
    key: string,
    message: string,
    errors: string[],
  ): number {
    const value = body[key];

    if (
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      value <= 0 ||
      value > 1_000_000
    ) {
      errors.push(message);
      return 0;
    }

    return value;
  }

  protected flag(
    body: Record<string, unknown>,
    key: string,
    message: string,
    errors: string[],
  ): boolean {
    const value = body[key];

    if (typeof value !== "boolean") {
      errors.push(message);
      return false;
    }

    return value;
  }

  protected textList(
    body: Record<string, unknown>,
    key: string,
    message: string,
    errors: string[],
    maxItems: number,
    maxLength: number,
  ): string[] {
    const value = body[key];

    if (
      !Array.isArray(value) ||
      value.length > maxItems ||
      !value.every(
        (entry) => typeof entry === "string" && entry.length <= maxLength,
      )
    ) {
      errors.push(message);
      return [];
    }

    return value
      .map((entry: string) => entry.trim())
      .filter((entry: string) => entry !== "");
  }
}
