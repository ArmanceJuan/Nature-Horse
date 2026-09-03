import { IOrderRepository } from "../../domain/interfaces/order-repository.interface.js";

export const cancelOrderUsecase = (orderRepository: IOrderRepository) => {
  return async (id: string, requestingUserId: string, isAdmin: boolean) => {
    return orderRepository.cancel(id, requestingUserId, isAdmin);
  };
};
