import { ProductFilters } from "../entities/product-filters.entity.js";
import { Product } from "../entities/product.entity.js";

export interface IProductRepository {
  findAll: (filters: ProductFilters) => Promise<Product[]>;
  findById: (id: string) => Promise<Product | null>;
}
