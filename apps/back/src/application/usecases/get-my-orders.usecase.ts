import { IOrderRepository } from "../../domain/interfaces/order-repository.interface.js";

export const getMyOrdersUsecase = (orderRepository: IOrderRepository) => {
  return async (userId: string) => {
    return orderRepository.findByUserId(userId);
  };
};
