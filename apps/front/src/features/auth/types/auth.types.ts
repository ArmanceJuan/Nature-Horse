export type UserRole = "ADMIN" | "STAFF" | "CLIENT";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: UserRole;
  otp_enable: boolean;
  createdAt: string;
  updatedAt: string;
}
