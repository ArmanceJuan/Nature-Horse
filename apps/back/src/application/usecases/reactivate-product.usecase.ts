import { IProductRepository } from "../../domain/interfaces/product-repository.interface.js";
import { AppError } from "../../api/middlewares/error-handler.middleware.js";

export const reactivateProductUsecase = (
  productRepository: IProductRepository,
) => {
  return async (id: string) => {
    const existing = await productRepository.findById(id);

    if (!existing) {
      throw new AppError("Product not found", 404);
    }

    return productRepository.updateStatus(id, "ACTIVE");
  };
};
