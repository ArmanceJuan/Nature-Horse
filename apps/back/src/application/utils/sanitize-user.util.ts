import { User } from "../../domain/entities/user.entity.js";

export const sanitizeUser = (user: User): Omit<User, "password"> => {
  const { password, ...safeUser } = user;
  return safeUser;
};
