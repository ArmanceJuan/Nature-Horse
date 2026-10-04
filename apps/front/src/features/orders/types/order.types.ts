export type OrderStatus =
  | "AWAITING_PAYMENT"
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
  userId: string | null;
  storeId: string;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string | null;
  status: OrderStatus;
  totalPrice: number;
  pickupReadyAt: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatedOrderResponse extends Order {
  trackingToken: string;
  checkoutUrl: string;
}
