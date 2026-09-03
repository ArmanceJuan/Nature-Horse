import { httpClient } from "../../../api/httpClient.js";

export interface CreateOrderPayload {
  storeId: string;
  items: { productVariantId: string; quantity: number }[];
}

export const ordersApi = {
  create: (payload: CreateOrderPayload) => httpClient.post("/orders", payload),
};
