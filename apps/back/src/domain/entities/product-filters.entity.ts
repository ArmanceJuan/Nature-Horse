import type { ProductStatus } from "./product.entity.js";

export interface ProductCriteria {
  status?: ProductStatus;
  collection?: string;
  discipline?: string;
  categorySlug?: string;
  isNew?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductFilters extends ProductCriteria {
  sizes?: string[];
  page?: number;
  limit?: number;
}
