import type { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "./error-handler.middleware.js";
import { ConflictError } from "../../domain/errors/http-errors.js";

class RecordingResponse {
  statusCode: number | null = null;
  body: unknown = null;

  status(code: number): this {
    this.statusCode = code;
    return this;
  }

  json(payload: unknown): this {
    this.body = payload;
    return this;
  }
}

const handle = (error: Error): RecordingResponse => {
  const response = new RecordingResponse();

  new ErrorHandler().handle(
    error,
    { method: "GET", path: "/test" } as Request,
    response as unknown as Response,
    (() => undefined) as NextFunction,
  );

  return response;
};

describe("ErrorHandler", () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    console.error = () => undefined;
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it("answers with the status and the message of an application error", () => {
    const response = handle(new ConflictError("Already there"));

    expect(response.statusCode).toBe(409);
    expect(response.body).toEqual({ message: "Already there" });
  });

  it("hides the details of an unexpected error", () => {
    const response = handle(new Error("password of the database is hunter2"));

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ message: "Internal server error" });
  });
});
