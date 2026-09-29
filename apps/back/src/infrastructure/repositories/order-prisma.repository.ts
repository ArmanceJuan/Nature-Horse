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
import type { DatabaseClient } from "../database/database-client.js";

const ORDER_INCLUDE = { items: true };

interface OrderRow {
  id: string;
  userId: string | null;
  storeId: string;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string | null;
  status: string;
  totalPrice: number;
  pickupReadyAt: Date;
  createdAt: Date;
  updatedAt: Date;
  items: {
    id: string;
    productVariantId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export class OrderPrismaRepository implements IOrderRepository {
  private readonly database: DatabaseClient;

  constructor(database: DatabaseClient) {
    this.database = database;
  }

  async create(data: NewOrderData): Promise<Order> {
    const lockOrder = [...data.items].sort((first, second) =>
      first.productVariantId.localeCompare(second.productVariantId),
    );

    const row = await this.database.$transaction(
      async (tx) => {
        for (const item of lockOrder) {
          const decrement = await tx.stock.updateMany({
            where: {
              productVariantId: item.productVariantId,
              storeId: data.storeId,
              quantity: { gte: item.quantity },
            },
            data: { quantity: { decrement: item.quantity } },
          });

          if (decrement.count === 0) {
            throw new ConflictError(
              `Insufficient stock for product "${item.productName}" in the selected store`,
            );
          }
        }

        return tx.order.create({
          data: {
            userId: data.userId,
            storeId: data.storeId,
            customerEmail: data.customerEmail,
            customerFirstName: data.customerFirstName,
            customerLastName: data.customerLastName,
            customerPhone: data.customerPhone,
            trackingToken: data.trackingToken.value,
            totalPrice: data.totalPrice,
            pickupReadyAt: data.pickupReadyAt,
            items: {
              create: data.items.map((item) => ({
                productVariantId: item.productVariantId,
                productName: item.productName,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
              })),
            },
          },
          include: ORDER_INCLUDE,
        });
      },
      { timeout: 15000 },
    );

    return this.toDomain(row);
  }

  async findById(id: string): Promise<Order | null> {
    const row = await this.database.order.findUnique({
      where: { id },
      include: ORDER_INCLUDE,
    });

    return row ? this.toDomain(row) : null;
  }

  async findByTrackingToken(token: TrackingToken): Promise<Order | null> {
    const row = await this.database.order.findUnique({
      where: { trackingToken: token.value },
      include: ORDER_INCLUDE,
    });

    return row ? this.toDomain(row) : null;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const rows = await this.database.order.findMany({
      where: { userId },
      include: ORDER_INCLUDE,
      orderBy: { createdAt: "desc" },
    });

    return rows.map((row) => this.toDomain(row));
  }

  async findAll(): Promise<Order[]> {
    const rows = await this.database.order.findMany({
      include: ORDER_INCLUDE,
      orderBy: { createdAt: "desc" },
    });

    return rows.map((row) => this.toDomain(row));
  }

  async updateStatus(
    id: string,
    from: OrderStatus,
    to: OrderStatus,
  ): Promise<Order> {
    const transition = await this.database.order.updateMany({
      where: { id, status: from },
      data: { status: to },
    });

    if (transition.count === 0) {
      throw new ConflictError(
        "The order status has changed. Reload the order and try again",
      );
    }

    const row = await this.database.order.findUniqueOrThrow({
      where: { id },
      include: ORDER_INCLUDE,
    });

    return this.toDomain(row);
  }

  async cancel(id: string): Promise<Order> {
    const row = await this.database.$transaction(async (tx) => {
      const existing = await tx.order.findUnique({
        where: { id },
        include: ORDER_INCLUDE,
      });

      if (!existing) {
        throw new NotFoundError("Order not found");
      }

      const transition = await tx.order.updateMany({
        where: { id, status: { in: ["PENDING", "READY_FOR_PICKUP"] } },
        data: { status: "CANCELLED" },
      });

      if (transition.count === 0) {
        throw new ConflictError(
          `Cannot cancel an order with status ${existing.status}`,
        );
      }

      for (const item of existing.items) {
        await tx.stock.updateMany({
          where: {
            productVariantId: item.productVariantId,
            storeId: existing.storeId,
          },
          data: { quantity: { increment: item.quantity } },
        });
      }

      return tx.order.findUniqueOrThrow({
        where: { id },
        include: ORDER_INCLUDE,
      });
    });

    return this.toDomain(row);
  }

  private toDomain(row: OrderRow): Order {
    return new Order({
      id: row.id,
      userId: row.userId,
      storeId: row.storeId,
      customerEmail: row.customerEmail,
      customerFirstName: row.customerFirstName,
      customerLastName: row.customerLastName,
      customerPhone: row.customerPhone,
      status: row.status as OrderStatus,
      totalPrice: row.totalPrice,
      pickupReadyAt: row.pickupReadyAt,
      items: row.items.map(
        (item) =>
          new OrderItem({
            id: item.id,
            productVariantId: item.productVariantId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          }),
      ),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
