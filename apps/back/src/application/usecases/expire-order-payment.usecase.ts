import { ConflictError } from "../../domain/errors/http-errors.js";
import type { IOrderRepository } from "../../domain/interfaces/order-repository.interface.js";

export class ExpireOrderPaymentUseCase {
  private readonly orderRepository: IOrderRepository;

  constructor(orderRepository: IOrderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(stripeSessionId: string): Promise<void> {
    const order =
      await this.orderRepository.findByStripeSessionId(stripeSessionId);

    if (!order) {
      return;
    }

    try {
      await this.orderRepository.expire(order.id);
    } catch (error) {
      if (error instanceof ConflictError) {
        return;
      }

      throw error;
    }
  }
}
