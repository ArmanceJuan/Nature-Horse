import type { Order } from "../../domain/entities/order.entity.js";
import { ConflictError } from "../../domain/errors/http-errors.js";
import type { IOrderRepository } from "../../domain/interfaces/order-repository.interface.js";
import type { GetOrderByTrackingTokenUseCase } from "./get-order-by-tracking-token.usecase.js";

export class CancelOrderByTrackingTokenUseCase {
  private readonly getOrderByTrackingToken: GetOrderByTrackingTokenUseCase;
  private readonly orderRepository: IOrderRepository;

  constructor(
    getOrderByTrackingToken: GetOrderByTrackingTokenUseCase,
    orderRepository: IOrderRepository,
  ) {
    this.getOrderByTrackingToken = getOrderByTrackingToken;
    this.orderRepository = orderRepository;
  }

  async execute(rawToken: string): Promise<Order> {
    const order = await this.getOrderByTrackingToken.execute(rawToken);

    if (!order.canBeCancelled()) {
      throw new ConflictError(
        `Cannot cancel an order with status ${order.status}`,
      );
    }

    return this.orderRepository.cancel(order.id);
  }
}
