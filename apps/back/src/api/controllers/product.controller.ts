import { Request, Response } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  archiveProduct,
  reactivateProduct,
  adjustStock,
} from "../config/dependency-injection.js";
import { AppError } from "../middlewares/error-handler.middleware.js";
import {
  validateCreateProductDTO,
  validateUpdateProductDTO,
} from "../dto/product.dto.js";
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

  create: asyncHandler(async (req: Request, res: Response) => {
    const validation = validateCreateProductDTO(req.body);

    if (!validation.isValid) {
      throw new AppError(validation.errors.join(", "), 400);
    }

    const product = await createProduct(req.body);

    res.status(201).json(product);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const validation = validateUpdateProductDTO(req.body);

    if (!validation.isValid) {
      throw new AppError(validation.errors.join(", "), 400);
    }

    const product = await updateProduct(id as string, req.body);

    res.status(200).json(product);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await deleteProduct(id as string);
    res.status(204).send();
  }),

  archive: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await archiveProduct(id as string);
    res.status(200).json(product);
  }),

  reactivate: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await reactivateProduct(id as string);
    res.status(200).json(product);
  }),

  adjustStock: asyncHandler(async (req: Request, res: Response) => {
    const { variantId } = req.params;
    const { storeId, quantity } = req.body;

    if (typeof storeId !== "string" || typeof quantity !== "number") {
      throw new AppError(
        "storeId (string) and quantity (number) are required",
        400,
      );
    }

    const product = await adjustStock(variantId as string, storeId, quantity);
    res.status(200).json(product);
  }),
};
