import { IProductRepository } from "../../domain/interfaces/product-repository.interface.js";
import { UpdateProductInput } from "../../domain/entities/update-product-input.entity.js";
import { AppError } from "../../api/middlewares/error-handler.middleware.js";

export const updateProductUsecase = (productRepository: IProductRepository) => {
  return async (id: string, data: UpdateProductInput) => {
    const existing = await productRepository.findById(id);

    if (!existing) {
      throw new AppError("Product not found", 404);
    }

    return productRepository.update(id, data);
  };
};
