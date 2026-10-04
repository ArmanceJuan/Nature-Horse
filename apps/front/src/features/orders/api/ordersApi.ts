import { httpClient } from "../../../api/httpClient.js";

export interface GuestCustomerPayload {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface CreateOrderPayload {
  storeId: string;
  customer?: GuestCustomerPayload;
  items: { productVariantId: string; quantity: number }[];
}

export const ordersApi = {
  create: (payload: CreateOrderPayload) => httpClient.post("/orders", payload),
  track: (token: string) => httpClient.get(`/orders/track/${token}`),
  cancelByToken: (token: string) =>
    httpClient.post(`/orders/track/${token}/cancel`),
  getMine: () => httpClient.get("/orders/me"),
  cancelMine: (id: string) => httpClient.post(`/orders/${id}/cancel`),
};
