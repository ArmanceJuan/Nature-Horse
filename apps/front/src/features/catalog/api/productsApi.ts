import { httpClient } from "../../../api/httpClient.js";

export interface ProductQueryParams {
  collection?: string;
  discipline?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  page?: number;
  limit?: number;
}

const buildQueryString = (params: ProductQueryParams): string => {
  const query = new URLSearchParams();

  if (params.collection) query.set("collection", params.collection);
  if (params.discipline) query.set("discipline", params.discipline);
  if (params.search) query.set("search", params.search);
  if (params.minPrice !== undefined)
    query.set("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined)
    query.set("maxPrice", String(params.maxPrice));
  if (params.sizes && params.sizes.length > 0)
    query.set("sizes", params.sizes.join(","));
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
};

export const productsApi = {
  getAll: (params: ProductQueryParams = {}) =>
    httpClient.get(`/products${buildQueryString(params)}`),
  getById: (id: string) => httpClient.get(`/products/${id}`),
};
