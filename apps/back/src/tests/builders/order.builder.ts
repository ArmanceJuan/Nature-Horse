import { Order, OrderItem } from "../../domain/entities/order.entity.js";
import type {
  OrderItemProps,
  OrderProps,
} from "../../domain/entities/order.entity.js";

export const buildOrderItem = (
  overrides: Partial<OrderItemProps> = {},
): OrderItem =>
  new OrderItem({
    id: "item-1",
    productVariantId: "variant-1",
    productName: "Test Product",
    quantity: 1,
    unitPrice: 100,
    ...overrides,
  });

export const buildOrder = (overrides: Partial<OrderProps> = {}): Order =>
  new Order({
    id: "order-1",
    userId: null,
    storeId: "store-1",
    customerEmail: "client@example.com",
    customerFirstName: "Jean",
    customerLastName: "Dupont",
    customerPhone: null,
    status: "PENDING",
    totalPrice: 100,
    pickupReadyAt: new Date("2026-01-01T11:00:00.000Z"),
    items: [buildOrderItem()],
    createdAt: new Date("2026-01-01T10:00:00.000Z"),
    updatedAt: new Date("2026-01-01T10:00:00.000Z"),
    ...overrides,
  });
