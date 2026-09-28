import { User } from "../../domain/entities/user.entity.js";
import type {
  IUserRepository,
  NewUserData,
} from "../../domain/interfaces/user-repository.interface.js";
import type { Email } from "../../domain/value-objects/email.js";

export class InMemoryUserRepository implements IUserRepository {
  private readonly users: User[];
  private sequence = 0;

  constructor(users: User[] = []) {
    this.users = [...users];
  }

  async findAll(): Promise<User[]> {
    return [...this.users];
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) ?? null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    return this.users.find((user) => user.email === email.value) ?? null;
  }

  async create(data: NewUserData): Promise<User> {
    this.sequence += 1;

    const user = new User({
      ...data,
      id: `created-user-${this.sequence}`,
      otpEnabled: false,
      otpSecret: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.users.push(user);

    return user;
  }
}
