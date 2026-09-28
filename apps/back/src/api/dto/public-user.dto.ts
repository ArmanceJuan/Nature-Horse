export interface UserSource {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: string;
  otp_enable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
  otp_enable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const toPublicUser = (user: UserSource): PublicUser => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  phone: user.phone ?? null,
  role: user.role,
  otp_enable: user.otp_enable,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
