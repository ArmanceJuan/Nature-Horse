import { Request, Response } from "express";
import { getAllUsers } from "../config/dependency-injection.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";

export const userController = {
  getAllUsers: asyncHandler(async (req: Request, res: Response) => {
    const users = await getAllUsers();
    res.status(200).json(users);
  }),
};
