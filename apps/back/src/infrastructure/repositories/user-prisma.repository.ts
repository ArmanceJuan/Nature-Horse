import { User } from "../../domain/entities/user.entity.js";
import type { Role } from "../../domain/entities/user.entity.js";
import { ConflictError } from "../../domain/errors/http-errors.js";
import type {
  IUserRepository,
  NewUserData,
} from "../../domain/interfaces/user-repository.interface.js";
import type { Email } from "../../domain/value-objects/email.js";
import type { DatabaseClient } from "../database/database-client.js";

interface UserRow {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
  otpEnabled: boolean;
  otpSecret: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class UserPrismaRepository implements IUserRepository {
  private readonly database: DatabaseClient;

  constructor(database: DatabaseClient) {
    this.database = database;
  }

  async findAll(): Promise<User[]> {
    const rows = await this.database.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    return rows.map((row) => this.toDomain(row));
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.database.user.findUnique({ where: { id } });

    return row ? this.toDomain(row) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const row = await this.database.user.findUnique({
      where: { email: email.value },
    });

    return row ? this.toDomain(row) : null;
  }

  async create(data: NewUserData): Promise<User> {
    try {
      const row = await this.database.user.create({ data });

      return this.toDomain(row);
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        throw new ConflictError("An account with this email already exists");
      }

      throw error;
    }
  }

  private isUniqueViolation(error: unknown): boolean {
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: unknown }).code === "P2002"
    );
  }

  private toDomain(row: UserRow): User {
    return new User({
      id: row.id,
      email: row.email,
      password: row.password,
      firstName: row.firstName,
      lastName: row.lastName,
      phone: row.phone,
      role: row.role as Role,
      otpEnabled: row.otpEnabled,
      otpSecret: row.otpSecret,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
