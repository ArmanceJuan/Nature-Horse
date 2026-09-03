import { Product } from "../entities/product.entity.js";
import { ProductFilters } from "../entities/product-filters.entity.js";
import { CreateProductInput } from "../entities/create-product-input.entity.js";

export interface IProductRepository {
  findAll: (filters: ProductFilters) => Promise<Product[]>;
  findById: (id: string) => Promise<Product | null>;
  create: (data: CreateProductInput) => Promise<Product>;
}
