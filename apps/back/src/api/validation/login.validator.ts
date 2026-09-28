import type { LoginInput } from "../../application/usecases/login-user.usecase.js";
import { Email } from "../../domain/value-objects/email.js";
import { Validator } from "./validator.js";

export class LoginValidator extends Validator<LoginInput> {
  private static readonly MAX_PASSWORD_LENGTH = 128;
  private static readonly MAX_CODE_LENGTH = 20;

  protected build(body: Record<string, unknown>, errors: string[]): LoginInput {
    const input: LoginInput = {
      email: this.text(
        body,
        "email",
        "Email is required",
        errors,
        Email.MAX_LENGTH,
      ),
      password: this.password(body.password, errors),
    };

    const code = body.code;

    if (code !== undefined && code !== null && code !== "") {
      if (this.isText(code, LoginValidator.MAX_CODE_LENGTH)) {
        input.code = code.trim();
      } else {
        errors.push("Code must be a string of at most 20 characters");
      }
    }

    return input;
  }

  private password(value: unknown, errors: string[]): string {
    if (
      typeof value !== "string" ||
      value.length === 0 ||
      value.length > LoginValidator.MAX_PASSWORD_LENGTH
    ) {
      errors.push("Password is required");
      return "";
    }

    return value;
  }
}
