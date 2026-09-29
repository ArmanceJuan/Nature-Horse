import { Order, OrderItem } from "../../domain/entities/order.entity.js";
import type { OrderStatus } from "../../domain/entities/order.entity.js";
import {
  ConflictError,
  NotFoundError,
} from "../../domain/errors/http-errors.js";
import type {
  IOrderRepository,
  NewOrderData,
} from "../../domain/interfaces/order-repository.interface.js";
import type { TrackingToken } from "../../domain/value-objects/tracking-token.js";
import type { InMemoryProductRepository } from "./in-memory-product.repository.js";

export class InMemoryOrderRepository implements IOrderRepository {
  private orders: Order[];
  private readonly tokens = new Map<string, string>();
  private readonly productRepository: InMemoryProductRepository | null;
  private sequence = 0;

  readonly createdData: NewOrderData[] = [];
  readonly cancelledIds: string[] = [];

  constructor(
    orders: Order[] = [],
    tokens: Record<string, string> = {},
    productRepository: InMemoryProductRepository | null = null,
  ) {
    this.orders = [...orders];
    Object.entries(tokens).forEach(([token, orderId]) =>
      this.tokens.set(token, orderId),
    );
    this.productRepository = productRepository;
  }

  async create(data: NewOrderData): Promise<Order> {
    if (this.productRepository) {
      for (const item of data.items) {
        await this.decrementStock(
          item.productVariantId,
          data.storeId,
          item.quantity,
        );
      }
    }

    this.sequence += 1;
    this.createdData.push(data);

    const id = `created-order-${this.sequence}`;

    const order = new Order({
      id,
      userId: data.userId,
      storeId: data.storeId,
      customerEmail: data.customerEmail,
      customerFirstName: data.customerFirstName,
      customerLastName: data.customerLastName,
      customerPhone: data.customerPhone,
      status: "PENDING",
      totalPrice: data.totalPrice,
      pickupReadyAt: data.pickupReadyAt,
      items: data.items.map(
        (item, index) => new OrderItem({ id: `${id}-item-${index}`, ...item }),
      ),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.orders.push(order);
    this.tokens.set(data.trackingToken.value, id);

    return order;
  }

  async findById(id: string): Promise<Order | null> {
    return this.orders.find((order) => order.id === id) ?? null;
  }

  async findByTrackingToken(token: TrackingToken): Promise<Order | null> {
    const orderId = this.tokens.get(token.value);

    return orderId ? this.findById(orderId) : null;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return this.orders.filter((order) => order.userId === userId);
  }

  async findAll(): Promise<Order[]> {
    return [...this.orders];
  }

  async updateStatus(
    id: string,
    from: OrderStatus,
    to: OrderStatus,
  ): Promise<Order> {
    const order = this.orders.find((candidate) => candidate.id === id);

    if (!order || order.status !== from) {
      throw new ConflictError(
        "The order status has changed. Reload the order and try again",
      );
    }

    const updated = order.withStatus(to);

    this.replace(updated);

    return updated;
  }

  async cancel(id: string): Promise<Order> {
    const order = this.orders.find((candidate) => candidate.id === id);

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (!order.canBeCancelled()) {
      throw new ConflictError(
        `Cannot cancel an order with status ${order.status}`,
      );
    }

    if (this.productRepository) {
      for (const item of order.items) {
        await this.incrementStock(
          item.productVariantId,
          order.storeId,
          item.quantity,
        );
      }
    }

    const updated = order.withStatus("CANCELLED");

    this.replace(updated);
    this.cancelledIds.push(id);

    return updated;
  }

  private async decrementStock(
    variantId: string,
    storeId: string,
    quantity: number,
  ): Promise<void> {
    const product = await this.productRepository!.findByVariantId(variantId);
    const current =
      product?.variants
        .find((variant) => variant.id === variantId)
        ?.stockInStore(storeId) ?? 0;

    await this.productRepository!.adjustStock(
      variantId,
      storeId,
      current - quantity,
    );
  }

  private async incrementStock(
    variantId: string,
    storeId: string,
    quantity: number,
  ): Promise<void> {
    const product = await this.productRepository!.findByVariantId(variantId);
    const current =
      product?.variants
        .find((variant) => variant.id === variantId)
        ?.stockInStore(storeId) ?? 0;

    await this.productRepository!.adjustStock(
      variantId,
      storeId,
      current + quantity,
    );
  }

  private replace(updated: Order): void {
    this.orders = this.orders.map((order) =>
      order.id === updated.id ? updated : order,
    );
  }
}
