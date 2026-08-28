export interface RegisterDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateRegisterDTO = (data: unknown): ValidationResult => {
  const errors: string[] = [];

  if (typeof data !== "object" || data === null) {
    return { isValid: false, errors: ["Invalid request body"] };
  }

  const body = data as Record<string, unknown>;

  if (typeof body.email !== "string" || !EMAIL_REGEX.test(body.email)) {
    errors.push("A valid email is required");
  }

  if (
    typeof body.password !== "string" ||
    !PASSWORD_REGEX.test(body.password)
  ) {
    errors.push(
      "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character",
    );
  }

  if (
    typeof body.firstName !== "string" ||
    body.firstName.trim().length === 0
  ) {
    errors.push("First name is required");
  }

  if (typeof body.lastName !== "string" || body.lastName.trim().length === 0) {
    errors.push("Last name is required");
  }

  if (body.phone !== undefined && typeof body.phone !== "string") {
    errors.push("Phone must be a string");
  }

  return { isValid: errors.length === 0, errors };
};

export interface LoginDTO {
  email: string;
  password: string;
  code?: string;
}

export const validateLoginDTO = (data: unknown): ValidationResult => {
  const errors: string[] = [];

  if (typeof data !== "object" || data === null) {
    return { isValid: false, errors: ["Invalid request body"] };
  }

  const body = data as Record<string, unknown>;

  if (typeof body.email !== "string" || body.email.trim().length === 0) {
    errors.push("Email is required");
  }

  if (typeof body.password !== "string" || body.password.length === 0) {
    errors.push("Password is required");
  }

  if (body.code !== undefined && typeof body.code !== "string") {
    errors.push("Code must be a string");
  }

  return { isValid: errors.length === 0, errors };
};
