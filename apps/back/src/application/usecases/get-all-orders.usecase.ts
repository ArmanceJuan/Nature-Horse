import type { Order } from "../../domain/entities/order.entity.js";
import type { IOrderRepository } from "../../domain/interfaces/order-repository.interface.js";

export class GetAllOrdersUseCase {
  private readonly orderRepository: IOrderRepository;

  constructor(orderRepository: IOrderRepository) {
    this.orderRepository = orderRepository;
  }

  execute(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }
}
