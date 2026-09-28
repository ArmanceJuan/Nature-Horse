import { Request, Response } from "express";
import { getAllCategories } from "../config/dependency-injection.js";
import { asyncHandler } from "../middlewares/async-handler.middleware.js";

export const categoryController = {
  getAll: asyncHandler(async (_req: Request, res: Response) => {
    const categories = await getAllCategories();
    res.status(200).json(categories);
  }),
};
