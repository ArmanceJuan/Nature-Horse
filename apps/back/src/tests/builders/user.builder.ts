import { User } from "../../domain/entities/user.entity.js";
import type { UserProps } from "../../domain/entities/user.entity.js";

export const buildUser = (overrides: Partial<UserProps> = {}): User =>
  new User({
    id: "user-1",
    email: "client@example.com",
    password: "hashed:Password1!",
    firstName: "Jean",
    lastName: "Dupont",
    phone: null,
    role: "CLIENT",
    otpEnabled: false,
    otpSecret: null,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    ...overrides,
  });
