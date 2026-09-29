import type { RequestHandler } from "express";
import {
  ForbiddenError,
  UnauthorizedError,
} from "../../domain/errors/http-errors.js";
import type { TokenPayload } from "../../domain/interfaces/token-service.interface.js";
import type { RouteGuards } from "../../api/middlewares/route-guards.js";

const HEADER = "x-test-user";

export class FakeGuards implements RouteGuards {
  requireAuth: RequestHandler = (req, _res, next) => {
    const user = this.readUser(req.headers[HEADER]);

    if (!user) {
      next(new UnauthorizedError());
      return;
    }

    req.user = user;
    next();
  };

  optionalAuth: RequestHandler = (req, _res, next) => {
    const user = this.readUser(req.headers[HEADER]);

    if (user) {
      req.user = user;
    }

    next();
  };

  requireRole =
    (...allowedRoles: string[]): RequestHandler =>
    (req, _res, next) => {
      if (!req.user) {
        next(new UnauthorizedError());
        return;
      }

      if (!allowedRoles.includes(req.user.role)) {
        next(new ForbiddenError());
        return;
      }

      next();
    };

  static headerFor(userId: string, role: string): [string, string] {
    return [HEADER, `${userId}:${role}`];
  }

  private readUser(value: unknown): TokenPayload | undefined {
    if (typeof value !== "string") {
      return undefined;
    }

    const [userId, role] = value.split(":");

    return userId && role
      ? { userId, role: role as TokenPayload["role"] }
      : undefined;
  }
}
