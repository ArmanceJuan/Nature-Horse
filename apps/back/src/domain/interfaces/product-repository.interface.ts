import type { CreateProductInput } from "../entities/create-product-input.entity.js";
import type { ProductCriteria } from "../entities/product-filters.entity.js";
import type { Product, ProductStatus } from "../entities/product.entity.js";
import type { UpdateProductInput } from "../entities/update-product-input.entity.js";

export interface IProductRepository {
  findAll(criteria: ProductCriteria): Promise<Product[]>;
  findById(idOrSlug: string): Promise<Product | null>;
  findByVariantId(variantId: string): Promise<Product | null>;
  create(data: CreateProductInput): Promise<Product>;
  update(id: string, changes: UpdateProductInput): Promise<Product>;
  delete(id: string): Promise<void>;
  hasBeenOrdered(id: string): Promise<boolean>;
  updateStatus(id: string, status: ProductStatus): Promise<Product>;
  adjustStock(
    variantId: string,
    storeId: string,
    quantity: number,
  ): Promise<Product>;
}
