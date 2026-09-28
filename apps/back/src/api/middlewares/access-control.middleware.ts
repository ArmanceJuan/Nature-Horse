import type { Request, RequestHandler } from "express";
import {
  ForbiddenError,
  UnauthorizedError,
} from "../../domain/errors/http-errors.js";
import type {
  ITokenService,
  TokenPayload,
} from "../../domain/interfaces/token-service.interface.js";
import { SessionCookie } from "../http/session-cookie.js";
import type { RouteGuards } from "./route-guards.js";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export class AccessControl implements RouteGuards {
  private readonly tokenService: ITokenService;

  constructor(tokenService: ITokenService) {
    this.tokenService = tokenService;
  }

  requireAuth: RequestHandler = (req, _res, next) => {
    const token = this.readToken(req);

    if (token === null) {
      next(new UnauthorizedError());
      return;
    }

    let payload: TokenPayload;

    try {
      payload = this.tokenService.verify(token);
    } catch (error) {
      next(error);
      return;
    }

    req.user = payload;
    next();
  };

  optionalAuth: RequestHandler = (req, _res, next) => {
    const token = this.readToken(req);

    if (token === null) {
      next();
      return;
    }

    let payload: TokenPayload;

    try {
      payload = this.tokenService.verify(token);
    } catch (error) {
      next(error);
      return;
    }

    req.user = payload;
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

  private readToken(req: Request): string | null {
    const token = req.cookies?.[SessionCookie.NAME];

    return typeof token === "string" && token !== "" ? token : null;
  }
}
