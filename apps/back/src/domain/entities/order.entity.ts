import type { Role } from "./user.entity.js";

export type OrderStatus =
  | "PENDING"
  | "READY_FOR_PICKUP"
  | "PICKED_UP"
  | "CANCELLED";

export const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "READY_FOR_PICKUP",
  "PICKED_UP",
  "CANCELLED",
];

export interface Requester {
  userId: string;
  role: Role;
}

export interface OrderItemProps {
  id: string;
  productVariantId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export class OrderItem {
  readonly id: string;
  readonly productVariantId: string;
  readonly productName: string;
  readonly quantity: number;
  readonly unitPrice: number;

  constructor(props: OrderItemProps) {
    this.id = props.id;
    this.productVariantId = props.productVariantId;
    this.productName = props.productName;
    this.quantity = props.quantity;
    this.unitPrice = props.unitPrice;
  }

  lineTotal(): number {
    return Math.round(this.unitPrice * this.quantity * 100) / 100;
  }
}

export interface OrderProps {
  id: string;
  userId: string | null;
  storeId: string;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string | null;
  status: OrderStatus;
  totalPrice: number;
  pickupReadyAt: Date;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export class Order {
  private static readonly TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ["READY_FOR_PICKUP"],
    READY_FOR_PICKUP: ["PICKED_UP"],
    PICKED_UP: [],
    CANCELLED: [],
  };

  readonly id: string;
  readonly userId: string | null;
  readonly storeId: string;
  readonly customerEmail: string;
  readonly customerFirstName: string;
  readonly customerLastName: string;
  readonly customerPhone: string | null;
  readonly status: OrderStatus;
  readonly totalPrice: number;
  readonly pickupReadyAt: Date;
  readonly items: OrderItem[];
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: OrderProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.storeId = props.storeId;
    this.customerEmail = props.customerEmail;
    this.customerFirstName = props.customerFirstName;
    this.customerLastName = props.customerLastName;
    this.customerPhone = props.customerPhone;
    this.status = props.status;
    this.totalPrice = props.totalPrice;
    this.pickupReadyAt = props.pickupReadyAt;
    this.items = props.items;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  isGuestOrder(): boolean {
    return this.userId === null;
  }

  isOwnedBy(userId: string): boolean {
    return this.userId !== null && this.userId === userId;
  }

  isAccessibleBy(requester: Requester): boolean {
    return requester.role === "ADMIN" || this.isOwnedBy(requester.userId);
  }

  canBeCancelled(): boolean {
    return this.status === "PENDING" || this.status === "READY_FOR_PICKUP";
  }

  canTransitionTo(target: OrderStatus): boolean {
    return Order.TRANSITIONS[this.status].includes(target);
  }

  unitCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  withStatus(status: OrderStatus): Order {
    return new Order({ ...this.toProps(), status });
  }

  private toProps(): OrderProps {
    return {
      id: this.id,
      userId: this.userId,
      storeId: this.storeId,
      customerEmail: this.customerEmail,
      customerFirstName: this.customerFirstName,
      customerLastName: this.customerLastName,
      customerPhone: this.customerPhone,
      status: this.status,
      totalPrice: this.totalPrice,
      pickupReadyAt: this.pickupReadyAt,
      items: this.items,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
