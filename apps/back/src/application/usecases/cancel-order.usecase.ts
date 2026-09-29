import type { Order, Requester } from "../../domain/entities/order.entity.js";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../../domain/errors/http-errors.js";
import type { IOrderRepository } from "../../domain/interfaces/order-repository.interface.js";

export class CancelOrderUseCase {
  private readonly orderRepository: IOrderRepository;

  constructor(orderRepository: IOrderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(id: string, requester: Requester): Promise<Order> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (!order.isAccessibleBy(requester)) {
      throw new ForbiddenError(
        "You do not have permission to cancel this order",
      );
    }

    if (!order.canBeCancelled()) {
      throw new ConflictError(
        `Cannot cancel an order with status ${order.status}`,
      );
    }

    return this.orderRepository.cancel(order.id);
  }
}
