import { Request, Response } from "express";
import {
  generateOtpSecret,
  enableOtp,
} from "../config/dependency-injection.js";
import { asyncHandler } from "../middlewares/async-handler.middleware.js";
import { AppError } from "../middlewares/error-handler.middleware.js";

export const otpController = {
  generateSecret: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const result = await generateOtpSecret(req.user.userId);

    res.status(200).json(result);
  }),

  enable: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const { secret, code } = req.body as { secret?: string; code?: string };

    if (!secret || !code) {
      throw new AppError("secret and code are required", 400);
    }

    const result = await enableOtp({
      userId: req.user.userId,
      secret,
      code,
    });

    res.status(200).json(result);
  }),
};
