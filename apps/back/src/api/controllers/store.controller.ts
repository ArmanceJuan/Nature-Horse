import type { Request, Response } from "express";
import type { GetAllStoresUseCase } from "../../application/usecases/get-all-stores.usecase.js";
import type { GetStoreByIdUseCase } from "../../application/usecases/get-store-by-id.usecase.js";
import { asyncHandler } from "../middlewares/async-handler.middleware.js";

export class StoreController {
  private readonly getAllStores: GetAllStoresUseCase;
  private readonly getStoreById: GetStoreByIdUseCase;

  constructor(
    getAllStores: GetAllStoresUseCase,
    getStoreById: GetStoreByIdUseCase,
  ) {
    this.getAllStores = getAllStores;
    this.getStoreById = getStoreById;
  }

  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const stores = await this.getAllStores.execute();

    res.status(200).json(stores);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const store = await this.getStoreById.execute(req.params.id as string);

    res.status(200).json(store);
  });
}
