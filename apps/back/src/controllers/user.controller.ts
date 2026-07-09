import { Request, Response } from "express";
import { userService } from "../services/user.service.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";

export const userController = {
  getAllUsers: asyncHandler(async (req: Request, res: Response) => {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  }),
};
