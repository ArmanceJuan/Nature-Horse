import { Request, Response } from "express";
import { getAllUsers } from "../config/dependency-injection.js";
import { asyncHandler } from "../middlewares/async-handler.middleware.js";
import { toPublicUser } from "../dto/public-user.dto.js";

export const userController = {
  getAllUsers: asyncHandler(async (req: Request, res: Response) => {
    const users = await getAllUsers();

    res.set("Cache-Control", "no-store");
    res.status(200).json(users.map(toPublicUser));
  }),
};
