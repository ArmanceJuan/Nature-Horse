import { prisma } from "../../config/prisma.js";
import {
  IOrderRepository,
  CreateOrderData,
} from "../../domain/interfaces/order-repository.interface.js";
import { Order, OrderStatus } from "../../domain/entities/order.entity.js";
import { AppError } from "../../api/middlewares/error-handler.middleware.js";

const ORDER_INCLUDE = { items: true };

const toDomainOrder = (raw: {
  id: string;
  userId: string;
  storeId: string;
  status: string;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  items: {
    id: string;
    productVariantId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
}): Order => ({
  id: raw.id,
  userId: raw.userId,
  storeId: raw.storeId,
  status: raw.status as OrderStatus,
  totalPrice: raw.totalPrice,
  items: raw.items,
  createdAt: raw.createdAt,
  updatedAt: raw.updatedAt,
});

export const orderPrismaRepository: IOrderRepository = {
  create: async (data: CreateOrderData) => {
    const order = await prisma.$transaction(async (tx) => {
      for (const item of data.items) {
        const stockUpdateResult = await tx.stock.updateMany({
          where: {
            productVariantId: item.productVariantId,
            storeId: data.storeId,
            quantity: { gte: item.quantity },
          },
          data: {
            quantity: { decrement: item.quantity },
          },
        });

        if (stockUpdateResult.count === 0) {
          throw new AppError(
            `Insufficient stock for product "${item.productName}" in the selected store`,
            409,
          );
        }
      }

      return tx.order.create({
        data: {
          userId: data.userId,
          storeId: data.storeId,
          totalPrice: data.totalPrice,
          items: {
            create: data.items.map((item) => ({
              productVariantId: item.productVariantId,
              productName: item.productName,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
        include: ORDER_INCLUDE,
      });
    });

    return toDomainOrder(order);
  },

  findById: async (id: string) => {
    const order = await prisma.order.findUnique({
      where: { id },
      include: ORDER_INCLUDE,
    });

    return order ? toDomainOrder(order) : null;
  },

  findByUserId: async (userId: string) => {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: ORDER_INCLUDE,
      orderBy: { createdAt: "desc" },
    });

    return orders.map(toDomainOrder);
  },

  findAll: async () => {
    const orders = await prisma.order.findMany({
      include: ORDER_INCLUDE,
      orderBy: { createdAt: "desc" },
    });

    return orders.map(toDomainOrder);
  },

  updateStatus: async (id: string, status: OrderStatus) => {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: ORDER_INCLUDE,
    });

    return toDomainOrder(order);
  },

  cancel: async (id: string, requestingUserId: string, isAdmin: boolean) => {
    const order = await prisma.$transaction(async (tx) => {
      const existing = await tx.order.findUnique({
        where: { id },
        include: ORDER_INCLUDE,
      });

      if (!existing) {
        throw new AppError("Order not found", 404);
      }

      if (!isAdmin && existing.userId !== requestingUserId) {
        throw new AppError(
          "You do not have permission to cancel this order",
          403,
        );
      }

      if (existing.status === "PICKED_UP" || existing.status === "CANCELLED") {
        throw new AppError(
          `Cannot cancel an order with status ${existing.status}`,
          409,
        );
      }

      for (const item of existing.items) {
        await tx.stock.updateMany({
          where: {
            productVariantId: item.productVariantId,
            storeId: existing.storeId,
          },
          data: { quantity: { increment: item.quantity } },
        });
      }

      return tx.order.update({
        where: { id },
        data: { status: "CANCELLED" },
        include: ORDER_INCLUDE,
      });
    });

    return toDomainOrder(order);
  },
};
