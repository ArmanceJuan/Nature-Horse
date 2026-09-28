import type { Role } from "../../domain/entities/user.entity.js";
import { UnauthorizedError } from "../../domain/errors/http-errors.js";
import type {
  ITokenService,
  TokenPayload,
} from "../../domain/interfaces/token-service.interface.js";

export class FakeTokenService implements ITokenService {
  sign(payload: TokenPayload): string {
    return `token:${payload.userId}:${payload.role}`;
  }

  verify(token: string): TokenPayload {
    const parts = token.split(":");

    if (parts.length !== 3 || parts[0] !== "token") {
      throw new UnauthorizedError("Invalid or expired token");
    }

    return { userId: parts[1], role: parts[2] as Role };
  }
}
