export type Role = "ADMIN" | "STAFF" | "CLIENT";

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: Role;
  otp_enable: boolean;
  otp_secret: string | null;
  createdAt: Date;
  updatedAt: Date;
}
