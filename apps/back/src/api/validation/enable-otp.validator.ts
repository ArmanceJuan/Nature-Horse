import { Validator } from "./validator.js";

export interface EnableOtpBody {
  secret: string;
  code: string;
}

export class EnableOtpValidator extends Validator<EnableOtpBody> {
  protected build(
    body: Record<string, unknown>,
    errors: string[],
  ): EnableOtpBody {
    return {
      secret: this.text(body, "secret", "secret is required", errors, 100),
      code: this.text(body, "code", "code is required", errors, 20),
    };
  }
}
