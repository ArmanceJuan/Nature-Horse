import { AppError } from "../../api/middlewares/error-handler.middleware.js";
import { IProductRepository } from "../../domain/interfaces/product-repository.interface.js";

export const deleteProductUsecase = (productRepository: IProductRepository) => {
  return async (id: string) => {
    const existing = await productRepository.findById(id);

    if (!existing) {
      throw new AppError("Product not found", 404);
    }

    await productRepository.delete(id);
  };
};
