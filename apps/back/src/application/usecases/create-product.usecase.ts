import { IProductRepository } from "../../domain/interfaces/product-repository.interface.js";
import { CreateProductInput } from "../../domain/entities/create-product-input.entity.js";
import { AppError } from "../../api/middlewares/error-handler.middleware.js";

export const createProductUsecase = (productRepository: IProductRepository) => {
  return async (input: CreateProductInput) => {
    const hasAnyStock = input.variants.some((variant) =>
      Object.values(variant.stockByStore).some((qty) => qty > 0),
    );

    if (!hasAnyStock) {
      throw new AppError(
        "At least one variant must have stock in at least one store",
        400,
      );
    }

    return productRepository.create(input);
  };
};
