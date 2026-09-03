import { IOrderRepository } from "../../domain/interfaces/order-repository.interface.js";

export const getAllOrdersUsecase = (orderRepository: IOrderRepository) => {
  return async () => {
    return orderRepository.findAll();
  };
};
