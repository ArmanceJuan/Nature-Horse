import type { Order, OrderStatus } from "../entities/order.entity.js";
import type { TrackingToken } from "../value-objects/tracking-token.js";

export interface NewOrderItemData {
  productVariantId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface NewOrderData {
  userId: string | null;
  storeId: string;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string | null;
  trackingToken: TrackingToken;
  pickupReadyAt: Date;
  totalPrice: number;
  items: NewOrderItemData[];
}

export interface IOrderRepository {
  create(data: NewOrderData): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findByTrackingToken(token: TrackingToken): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  findAll(): Promise<Order[]>;
  updateStatus(id: string, from: OrderStatus, to: OrderStatus): Promise<Order>;
  cancel(id: string): Promise<Order>;
}
