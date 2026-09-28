import type { Role, User } from "../entities/user.entity.js";
import type { Email } from "../value-objects/email.js";

export interface NewUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: Role;
}

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  create(data: NewUserData): Promise<User>;
}
