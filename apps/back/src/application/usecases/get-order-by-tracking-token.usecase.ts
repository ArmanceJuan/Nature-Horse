import type { Order } from "../../domain/entities/order.entity.js";
import { NotFoundError } from "../../domain/errors/http-errors.js";
import type { IOrderRepository } from "../../domain/interfaces/order-repository.interface.js";
import { TrackingToken } from "../../domain/value-objects/tracking-token.js";

export class GetOrderByTrackingTokenUseCase {
  private readonly orderRepository: IOrderRepository;

  constructor(orderRepository: IOrderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(rawToken: string): Promise<Order> {
    const token = TrackingToken.tryOf(rawToken);

    if (!token) {
      throw new NotFoundError("Order not found");
    }

    const order = await this.orderRepository.findByTrackingToken(token);

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    return order;
  }
}
