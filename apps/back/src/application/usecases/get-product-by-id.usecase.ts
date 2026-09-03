import { AppError } from "../../api/middlewares/error-handler.middleware.js";
import { IProductRepository } from "../../domain/interfaces/product-repository.interface.js";

export const getProductByIdUsecase = (
  productRepository: IProductRepository,
) => {
  return async (id: string) => {
    const product = await productRepository.findById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return product;
  };
};
