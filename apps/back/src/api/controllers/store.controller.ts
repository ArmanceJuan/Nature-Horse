import { Request, Response } from "express";
import { getAllStores, getStoreById } from "../config/dependency-injection.js";
import { asyncHandler } from "../middlewares/async-handler.middleware.js";

export const storeController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const stores = await getAllStores();
    res.status(200).json(stores);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const store = await getStoreById(id as string);
    res.status(200).json(store);
  }),
};
