import { IOrderRepository } from "../../domain/interfaces/order-repository.interface.js";
import { IProductRepository } from "../../domain/interfaces/product-repository.interface.js";
import { CreateOrderInput } from "../../domain/entities/create-order-input.entity.js";
import { AppError } from "../../api/middlewares/error-handler.middleware.js";

export const createOrderUsecase = (
  orderRepository: IOrderRepository,
  productRepository: IProductRepository,
) => {
  return async (input: CreateOrderInput) => {
    if (input.items.length === 0) {
      throw new AppError("Order must contain at least one item", 400);
    }

    const resolvedItems: {
      productVariantId: string;
      productName: string;
      quantity: number;
      unitPrice: number;
    }[] = [];

    for (const item of input.items) {
      if (item.quantity <= 0) {
        throw new AppError("Item quantity must be positive", 400);
      }

      const product = await productRepository.findByVariantId(
        item.productVariantId,
      );

      if (!product) {
        throw new AppError(
          `Product variant ${item.productVariantId} not found`,
          404,
        );
      }

      resolvedItems.push({
        productVariantId: item.productVariantId,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
      });
    }

    const totalPrice = resolvedItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    return orderRepository.create({
      userId: input.userId,
      storeId: input.storeId,
      totalPrice,
      items: resolvedItems,
    });
  };
};
