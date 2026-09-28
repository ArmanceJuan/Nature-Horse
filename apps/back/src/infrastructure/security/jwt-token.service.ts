import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import type { Role } from "../../domain/entities/user.entity.js";
import { UnauthorizedError } from "../../domain/errors/http-errors.js";
import type {
  ITokenService,
  TokenPayload,
} from "../../domain/interfaces/token-service.interface.js";

const ROLES: Role[] = ["ADMIN", "STAFF", "CLIENT"];

export class JwtTokenService implements ITokenService {
  static readonly MIN_SECRET_LENGTH = 32;

  private readonly secret: string;
  private readonly expiresInSeconds: number;

  constructor(
    secret: string | undefined,
    expiresInSeconds: number = 7 * 24 * 60 * 60,
  ) {
    if (!secret || secret.length < JwtTokenService.MIN_SECRET_LENGTH) {
      throw new Error(
        `JWT_SECRET must be defined and at least ${JwtTokenService.MIN_SECRET_LENGTH} characters long`,
      );
    }

    this.secret = secret;
    this.expiresInSeconds = expiresInSeconds;
  }

  sign(payload: TokenPayload): string {
    return jwt.sign(
      { userId: payload.userId, role: payload.role },
      this.secret,
      {
        algorithm: "HS256",
        expiresIn: this.expiresInSeconds,
      },
    );
  }

  verify(token: string): TokenPayload {
    let decoded: string | JwtPayload;

    try {
      decoded = jwt.verify(token, this.secret, { algorithms: ["HS256"] });
    } catch {
      throw new UnauthorizedError("Invalid or expired token");
    }

    if (
      typeof decoded === "string" ||
      typeof decoded.userId !== "string" ||
      !ROLES.includes(decoded.role as Role)
    ) {
      throw new UnauthorizedError("Invalid or expired token");
    }

    return { userId: decoded.userId, role: decoded.role as Role };
  }
}
