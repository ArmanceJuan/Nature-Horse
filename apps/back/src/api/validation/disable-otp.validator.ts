import { Validator } from "./validator.js";

export interface DisableOtpBody {
  password: string;
}

export class DisableOtpValidator extends Validator<DisableOtpBody> {
  protected build(
    body: Record<string, unknown>,
    errors: string[],
  ): DisableOtpBody {
    return {
      password: this.passwordField(
        body,
        "password",
        "password is required",
        errors,
        128,
      ),
    };
  }
}
