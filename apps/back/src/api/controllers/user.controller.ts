import type { Request, Response } from "express";
import type { GetAllUsersUseCase } from "../../application/usecases/get-all-users.usecase.js";
import { asyncHandler } from "../middlewares/async-handler.middleware.js";

export class UserController {
  private readonly getAllUsers: GetAllUsersUseCase;

  constructor(getAllUsers: GetAllUsersUseCase) {
    this.getAllUsers = getAllUsers;
  }

  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const users = await this.getAllUsers.execute();

    res.set("Cache-Control", "no-store");
    res.status(200).json(users);
  });
}
