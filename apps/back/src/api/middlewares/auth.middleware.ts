import { Request, Response, NextFunction } from "express";
import {
  verifyToken,
  JwtPayload,
} from "../../infrastructure/security/jwt.util.js";
import { AppError } from "./error-handler.middleware.js";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.access_token;

  if (!token) {
    throw new AppError("Authentication required", 401);
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    throw new AppError("Invalid or expired token", 401);
  }
};
