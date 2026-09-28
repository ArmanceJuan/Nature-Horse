import type { Request, Response } from "express";
import type { GetAllCategoriesUseCase } from "../../application/usecases/get-all-categories.usecase.js";
import { asyncHandler } from "../middlewares/async-handler.middleware.js";

export class CategoryController {
  private readonly getAllCategories: GetAllCategoriesUseCase;

  constructor(getAllCategories: GetAllCategoriesUseCase) {
    this.getAllCategories = getAllCategories;
  }

  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const categories = await this.getAllCategories.execute();

    res.status(200).json(categories);
  });
}
