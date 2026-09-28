export type Role = "ADMIN" | "STAFF" | "CLIENT";

export interface UserProps {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: Role;
  otpEnabled: boolean;
  otpSecret: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: Role;
  otpEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  readonly id: string;
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phone: string | null;
  readonly role: Role;
  readonly otpEnabled: boolean;
  readonly otpSecret: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email;
    this.password = props.password;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.phone = props.phone;
    this.role = props.role;
    this.otpEnabled = props.otpEnabled;
    this.otpSecret = props.otpSecret;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  isAdmin(): boolean {
    return this.role === "ADMIN";
  }

  hasRole(...roles: Role[]): boolean {
    return roles.includes(this.role);
  }

  fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  toPublic(): PublicUser {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      role: this.role,
      otpEnabled: this.otpEnabled,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  toJSON(): PublicUser {
    return this.toPublic();
  }
}
