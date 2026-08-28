import { Request, Response } from "express";
import { registerUser, loginUser } from "../config/dependency-injection.js";
import { AppError } from "../middlewares/error-handler.middleware.js";
import { validateRegisterDTO, validateLoginDTO } from "../dto/user.dto.js";
import { asyncHandler } from "../middlewares/async-handler.middleware.js";

const isProduction = process.env.NODE_ENV === "production";

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const validation = validateRegisterDTO(req.body);

    if (!validation.isValid) {
      throw new AppError(validation.errors.join(", "), 400);
    }

    const newUser = await registerUser(req.body);

    res.status(201).json(newUser);
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const validation = validateLoginDTO(req.body);

    if (!validation.isValid) {
      throw new AppError(validation.errors.join(", "), 400);
    }

    const result = await loginUser(req.body);

    if (result.requiresOtp) {
      return res.status(200).json({ requiresOtp: true });
    }

    res.cookie("access_token", result.token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(result.user);
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({ userId: req.user?.userId, role: req.user?.role });
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
  }),
};
