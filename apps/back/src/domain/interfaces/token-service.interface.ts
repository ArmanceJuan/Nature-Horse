import type { Role } from "../entities/user.entity.js";

export interface TokenPayload {
  userId: string;
  role: Role;
}

export interface ITokenService {
  sign(payload: TokenPayload): string;
  verify(token: string): TokenPayload;
}
