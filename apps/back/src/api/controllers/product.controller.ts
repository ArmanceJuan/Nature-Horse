import { Request, Response } from "express";
import {
  getAllProducts,
  getProductById,
} from "../config/dependency-injection.js";
import { asyncHandler } from "../middlewares/async-handler.middleware.js";

const parsePrice = (value: unknown): number | undefined => {
  if (typeof value !== "string") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
};

const parsePositiveInt = (value: unknown): number | undefined => {
  if (typeof value !== "string") return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
};

export const productController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const {
      collection,
      discipline,
      search,
      minPrice,
      maxPrice,
      sizes,
      page,
      limit,
    } = req.query;

    const products = await getAllProducts({
      collection: typeof collection === "string" ? collection : undefined,
      discipline: typeof discipline === "string" ? discipline : undefined,
      search: typeof search === "string" ? search : undefined,
      minPrice: parsePrice(minPrice),
      maxPrice: parsePrice(maxPrice),
      sizes: typeof sizes === "string" ? sizes.split(",") : undefined,
      page: parsePositiveInt(page),
      limit: parsePositiveInt(limit),
    });

    res.status(200).json(products);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await getProductById(id as string);
    res.status(200).json(product);
  }),
};
