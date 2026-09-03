export interface ProductFilters {
  collection?: string;
  discipline?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  page?: number;
  limit?: number;
}
