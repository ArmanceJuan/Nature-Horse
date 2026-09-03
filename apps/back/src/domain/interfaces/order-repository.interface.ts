import { Order, OrderStatus } from "../entities/order.entity.js";

export interface CreateOrderData {
  userId: string;
  storeId: string;
  totalPrice: number;
  items: {
    productVariantId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface IOrderRepository {
  create: (data: CreateOrderData) => Promise<Order>;
  findById: (id: string) => Promise<Order | null>;
  findByUserId: (userId: string) => Promise<Order[]>;
  findAll: () => Promise<Order[]>;
  updateStatus: (id: string, status: OrderStatus) => Promise<Order>;
  cancel: (
    id: string,
    requestingUserId: string,
    isAdmin: boolean,
  ) => Promise<Order>;
}
