import { IOrderRepository } from "../../domain/interfaces/order-repository.interface.js";
import { OrderStatus } from "../../domain/entities/order.entity.js";
import { AppError } from "../../api/middlewares/error-handler.middleware.js";

const ALLOWED_STATUSES: OrderStatus[] = [
  "PENDING",
  "READY_FOR_PICKUP",
  "PICKED_UP",
];

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["READY_FOR_PICKUP"],
  READY_FOR_PICKUP: ["PICKED_UP"],
  PICKED_UP: [],
  CANCELLED: [],
};

export const updateOrderStatusUsecase = (orderRepository: IOrderRepository) => {
  return async (id: string, status: string) => {
    if (!ALLOWED_STATUSES.includes(status as OrderStatus)) {
      throw new AppError(
        "Invalid status. Use the cancel endpoint to cancel an order.",
        400,
      );
    }

    const existing = await orderRepository.findById(id);

    if (!existing) {
      throw new AppError("Order not found", 404);
    }

    if (!VALID_TRANSITIONS[existing.status].includes(status as OrderStatus)) {
      throw new AppError(
        `Cannot transition from ${existing.status} to ${status}`,
        409,
      );
    }

    return orderRepository.updateStatus(id, status as OrderStatus);
  };
};
