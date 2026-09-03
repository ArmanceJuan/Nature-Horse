import { IOrderRepository } from "../../domain/interfaces/order-repository.interface.js";
import { AppError } from "../../api/middlewares/error-handler.middleware.js";

export const getOrderByIdUsecase = (orderRepository: IOrderRepository) => {
  return async (id: string, requestingUserId: string, isAdmin: boolean) => {
    const order = await orderRepository.findById(id);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    if (!isAdmin && order.userId !== requestingUserId) {
      throw new AppError("You do not have permission to view this order", 403);
    }

    return order;
  };
};
