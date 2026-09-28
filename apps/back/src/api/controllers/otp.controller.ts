import type { Request, Response } from "express";
import type { EnableOtpUseCase } from "../../application/usecases/enable-otp.usecase.js";
import type { GenerateOtpSecretUseCase } from "../../application/usecases/generate-otp-secret.usecase.js";
import { UnauthorizedError } from "../../domain/errors/http-errors.js";
import { asyncHandler } from "../middlewares/async-handler.middleware.js";
import type { EnableOtpBody } from "../validation/enable-otp.validator.js";
import type { IValidator } from "../validation/validator.js";

export interface OtpControllerDependencies {
  generateOtpSecret: GenerateOtpSecretUseCase;
  enableOtp: EnableOtpUseCase;
  enableOtpValidator: IValidator<EnableOtpBody>;
}

export class OtpController {
  private readonly dependencies: OtpControllerDependencies;

  constructor(dependencies: OtpControllerDependencies) {
    this.dependencies = dependencies;
  }

  generateSecret = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.dependencies.generateOtpSecret.execute(
      this.currentUserId(req),
    );

    res.set("Cache-Control", "no-store");
    res.status(200).json(result);
  });

  enable = asyncHandler(async (req: Request, res: Response) => {
    const userId = this.currentUserId(req);
    const body = this.dependencies.enableOtpValidator.parse(req.body);
    const result = await this.dependencies.enableOtp.execute({
      userId,
      ...body,
    });

    res.set("Cache-Control", "no-store");
    res.status(200).json(result);
  });

  private currentUserId(req: Request): string {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    return req.user.userId;
  }
}
