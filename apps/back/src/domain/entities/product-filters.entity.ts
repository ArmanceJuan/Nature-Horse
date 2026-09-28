export interface ProductFilters {
  collection?: string;
  discipline?: string;
  categorySlug?: string;
  isNew?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  page?: number;
  limit?: number;
}
