import type { RegisterInput } from "../../application/usecases/register-user.usecase.js";
import { Email } from "../../domain/value-objects/email.js";
import { Validator } from "./validator.js";

export class RegisterValidator extends Validator<RegisterInput> {
  private static readonly PASSWORD_PATTERN =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  private static readonly PHONE_PATTERN = /^[0-9+().\-\s]{6,20}$/;
  private static readonly MAX_PASSWORD_BYTES = 72;
  private static readonly PASSWORD_MESSAGE =
    "Password must be 8 to 72 characters long and include one uppercase letter, one lowercase letter, one number, and one special character";

  protected build(
    body: Record<string, unknown>,
    errors: string[],
  ): RegisterInput {
    const rawEmail = body.email;
    const rawPassword = body.password;

    const email =
      typeof rawEmail === "string" && Email.isValid(rawEmail)
        ? rawEmail.trim()
        : "";

    if (email === "") {
      errors.push("A valid email is required");
    }

    const password =
      typeof rawPassword === "string" && this.isStrongPassword(rawPassword)
        ? rawPassword
        : "";

    if (password === "") {
      errors.push(RegisterValidator.PASSWORD_MESSAGE);
    }

    const input: RegisterInput = {
      email,
      password,
      firstName: this.text(
        body,
        "firstName",
        "First name is required",
        errors,
        50,
      ),
      lastName: this.text(
        body,
        "lastName",
        "Last name is required",
        errors,
        50,
      ),
    };

    const phone = this.optionalPhone(body.phone, errors);

    if (phone !== undefined) {
      input.phone = phone;
    }

    return input;
  }

  private isStrongPassword(password: string): boolean {
    return (
      RegisterValidator.PASSWORD_PATTERN.test(password) &&
      Buffer.byteLength(password, "utf8") <=
        RegisterValidator.MAX_PASSWORD_BYTES
    );
  }

  private optionalPhone(value: unknown, errors: string[]): string | undefined {
    if (value === undefined || value === null || value === "") {
      return undefined;
    }

    if (
      typeof value !== "string" ||
      !RegisterValidator.PHONE_PATTERN.test(value.trim())
    ) {
      errors.push("Phone number is invalid");
      return undefined;
    }

    return value.trim();
  }
}
