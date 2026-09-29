import type { Order, Requester } from "../../domain/entities/order.entity.js";
import {
  ForbiddenError,
  NotFoundError,
} from "../../domain/errors/http-errors.js";
import type { IOrderRepository } from "../../domain/interfaces/order-repository.interface.js";

export class GetOrderByIdUseCase {
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
      throw new ForbiddenError("You do not have permission to view this order");
    }

    return order;
  }
}
