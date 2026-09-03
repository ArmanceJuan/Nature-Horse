import { IProductRepository } from "../../domain/interfaces/product-repository.interface.js";
import { AppError } from "../../api/middlewares/error-handler.middleware.js";

export const adjustStockUsecase = (productRepository: IProductRepository) => {
  return async (variantId: string, storeId: string, quantity: number) => {
    if (quantity < 0) {
      throw new AppError("Quantity cannot be negative", 400);
    }

    return productRepository.adjustStock(variantId, storeId, quantity);
  };
};
