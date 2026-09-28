import { AppError } from "./app.error.js";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "./http-errors.js";

describe("HTTP errors", () => {
  it("are all AppError instances carrying their HTTP status", () => {
    const cases: [AppError, number][] = [
      [new ValidationError("invalid"), 400],
      [new UnauthorizedError(), 401],
      [new ForbiddenError(), 403],
      [new NotFoundError(), 404],
      [new ConflictError("conflict"), 409],
    ];

    cases.forEach(([error, status]) => {
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(Error);
      expect(error.statusCode).toBe(status);
    });
  });

  it("keeps the name of the concrete class", () => {
    expect(new NotFoundError().name).toBe("NotFoundError");
    expect(new ConflictError("conflict").name).toBe("ConflictError");
  });

  it("defaults to a 500 status for a plain AppError", () => {
    expect(new AppError("unexpected").statusCode).toBe(500);
  });

  it("uses the message it is given", () => {
    expect(new NotFoundError("Store not found").message).toBe(
      "Store not found",
    );
  });
});
