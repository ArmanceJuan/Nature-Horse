export type OrderStatus =
  | "PENDING"
  | "READY_FOR_PICKUP"
  | "PICKED_UP"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  productVariantId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  storeId: string;
  status: OrderStatus;
  totalPrice: number;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}
