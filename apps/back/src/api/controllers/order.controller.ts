import type { Request, Response } from "express";
import type { CancelOrderByTrackingTokenUseCase } from "../../application/usecases/cancel-order-by-tracking-token.usecase.js";
import type { CancelOrderUseCase } from "../../application/usecases/cancel-order.usecase.js";
import type { CreateOrderUseCase } from "../../application/usecases/create-order.usecase.js";
import type { GetAllOrdersUseCase } from "../../application/usecases/get-all-orders.usecase.js";
import type { GetMyOrdersUseCase } from "../../application/usecases/get-my-orders.usecase.js";
import type { GetOrderByIdUseCase } from "../../application/usecases/get-order-by-id.usecase.js";
import type { GetOrderByTrackingTokenUseCase } from "../../application/usecases/get-order-by-tracking-token.usecase.js";
import type { UpdateOrderStatusUseCase } from "../../application/usecases/update-order-status.usecase.js";
import type { Requester } from "../../domain/entities/order.entity.js";
import { UnauthorizedError } from "../../domain/errors/http-errors.js";
import { asyncHandler } from "../middlewares/async-handler.middleware.js";
import type { CreateOrderBody } from "../validation/create-order.validator.js";
import type { UpdateOrderStatusBody } from "../validation/update-order-status.validator.js";
import type { IValidator } from "../validation/validator.js";

export interface OrderControllerDependencies {
  createOrder: CreateOrderUseCase;
  getMyOrders: GetMyOrdersUseCase;
  getAllOrders: GetAllOrdersUseCase;
  getOrderById: GetOrderByIdUseCase;
  getOrderByTrackingToken: GetOrderByTrackingTokenUseCase;
  updateOrderStatus: UpdateOrderStatusUseCase;
  cancelOrder: CancelOrderUseCase;
  cancelOrderByTrackingToken: CancelOrderByTrackingTokenUseCase;
  createOrderValidator: IValidator<CreateOrderBody>;
  updateOrderStatusValidator: IValidator<UpdateOrderStatusBody>;
}

export class OrderController {
  private readonly dependencies: OrderControllerDependencies;

  constructor(dependencies: OrderControllerDependencies) {
    this.dependencies = dependencies;
  }

  create = asyncHandler(async (req: Request, res: Response) => {
    const body = this.dependencies.createOrderValidator.parse(req.body);

    const { order, trackingToken, checkoutUrl } =
      await this.dependencies.createOrder.execute({
        userId: req.user?.userId ?? null,
        storeId: body.storeId,
        guest: req.user ? undefined : body.customer,
        items: body.items,
      });

    res.set("Cache-Control", "no-store");
    res
      .status(201)
      .json({ ...order, trackingToken: trackingToken.value, checkoutUrl });
  });

  getMine = asyncHandler(async (req: Request, res: Response) => {
    const orders = await this.dependencies.getMyOrders.execute(
      this.requester(req).userId,
    );

    res.set("Cache-Control", "no-store");
    res.status(200).json(orders);
  });

  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const orders = await this.dependencies.getAllOrders.execute();

    res.set("Cache-Control", "no-store");
    res.status(200).json(orders);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const order = await this.dependencies.getOrderById.execute(
      req.params.id as string,
      this.requester(req),
    );

    res.set("Cache-Control", "no-store");
    res.status(200).json(order);
  });

  track = asyncHandler(async (req: Request, res: Response) => {
    const order = await this.dependencies.getOrderByTrackingToken.execute(
      req.params.trackingToken as string,
    );

    res.set("Cache-Control", "no-store");
    res.status(200).json(order);
  });

  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const body = this.dependencies.updateOrderStatusValidator.parse(req.body);
    const order = await this.dependencies.updateOrderStatus.execute(
      req.params.id as string,
      body.status,
    );

    res.status(200).json(order);
  });

  cancel = asyncHandler(async (req: Request, res: Response) => {
    const order = await this.dependencies.cancelOrder.execute(
      req.params.id as string,
      this.requester(req),
    );

    res.status(200).json(order);
  });

  cancelByTrackingToken = asyncHandler(async (req: Request, res: Response) => {
    const order = await this.dependencies.cancelOrderByTrackingToken.execute(
      req.params.trackingToken as string,
    );

    res.status(200).json(order);
  });

  private requester(req: Request): Requester {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    return req.user;
  }
}
