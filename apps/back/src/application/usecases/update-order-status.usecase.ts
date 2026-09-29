import type { Order, OrderStatus } from "../../domain/entities/order.entity.js";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../domain/errors/http-errors.js";
import type { IOrderRepository } from "../../domain/interfaces/order-repository.interface.js";

export class UpdateOrderStatusUseCase {
  private readonly orderRepository: IOrderRepository;

  constructor(orderRepository: IOrderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(id: string, target: OrderStatus): Promise<Order> {
    if (target === "CANCELLED") {
      throw new ValidationError("Use the cancel endpoint to cancel an order");
    }

    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (!order.canTransitionTo(target)) {
      throw new ConflictError(
        `Cannot move an order from ${order.status} to ${target}`,
      );
    }

    return this.orderRepository.updateStatus(id, order.status, target);
  }
}
