import { IProductRepository } from "../../domain/interfaces/product-repository.interface.js";
import { ProductFilters } from "../../domain/entities/product-filters.entity.js";

export const getAllProductsUsecase = (
  productRepository: IProductRepository,
) => {
  return async (filters: ProductFilters) => {
    return productRepository.findAll(filters);
  };
};
