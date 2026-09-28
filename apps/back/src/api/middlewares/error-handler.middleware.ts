import { Request, Response, NextFunction } from "express";
import { AppError } from "../../domain/errors/app.error.js";

export { AppError } from "../../domain/errors/app.error.js";

export class ErrorHandler {
  handle = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction,
  ): void => {
    console.error(`[Error] ${req.method} ${req.path}:`, err);

    if (err instanceof AppError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: "Internal server error" });
  };
}

export const errorHandler = new ErrorHandler().handle;
