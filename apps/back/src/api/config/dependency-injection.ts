import { cancelOrderUsecase } from "../../application/usecases/cancel-order.usecase.js";
import { createOrderUsecase } from "../../application/usecases/create-order.usecase.js";
import { getAllOrdersUsecase } from "../../application/usecases/get-all-orders.usecase.js";
import { getMyOrdersUsecase } from "../../application/usecases/get-my-orders.usecase.js";
import { getOrderByIdUsecase } from "../../application/usecases/get-order-by-id.usecase.js";
import { updateOrderStatusUsecase } from "../../application/usecases/update-order-status.usecase.js";
import { orderPrismaRepository } from "../../infrastructure/repositories/order-prisma.repository.js";
import { container } from "./container.js";

export const createOrder = createOrderUsecase(
  orderPrismaRepository,
  container.productRepository,
);
export const getMyOrders = getMyOrdersUsecase(orderPrismaRepository);
export const getAllOrders = getAllOrdersUsecase(orderPrismaRepository);
export const getOrderById = getOrderByIdUsecase(orderPrismaRepository);
export const updateOrderStatus = updateOrderStatusUsecase(
  orderPrismaRepository,
);
export const cancelOrder = cancelOrderUsecase(orderPrismaRepository);
