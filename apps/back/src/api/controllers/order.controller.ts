import { Request, Response } from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from "../config/dependency-injection.js";
import { AppError } from "../middlewares/error-handler.middleware.js";
import { validateCreateOrderDTO } from "../dto/order.dto.js";
import { asyncHandler } from "../middlewares/async-handler.middleware.js";

export const orderController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const validation = validateCreateOrderDTO(req.body);

    if (!validation.isValid) {
      throw new AppError(validation.errors.join(", "), 400);
    }

    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const order = await createOrder({
      userId: req.user.userId,
      storeId: req.body.storeId,
      items: req.body.items,
    });

    res.status(201).json(order);
  }),

  getMine: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const orders = await getMyOrders(req.user.userId);
    res.status(200).json(orders);
  }),

  getAll: asyncHandler(async (req: Request, res: Response) => {
    const orders = await getAllOrders();
    res.status(200).json(orders);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const { id } = req.params;
    const isAdmin = req.user.role === "ADMIN";
    const order = await getOrderById(id as string, req.user.userId, isAdmin);

    res.status(200).json(order);
  }),

  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (typeof status !== "string") {
      throw new AppError("status is required", 400);
    }

    const order = await updateOrderStatus(id as string, status);
    res.status(200).json(order);
  }),

  cancel: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const { id } = req.params;
    const isAdmin = req.user.role === "ADMIN";
    const order = await cancelOrder(id as string, req.user.userId, isAdmin);

    res.status(200).json(order);
  }),
};
