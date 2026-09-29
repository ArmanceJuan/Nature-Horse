import { ORDER_STATUSES } from "./order.entity.js";
import type { OrderStatus } from "./order.entity.js";
import {
  buildOrder,
  buildOrderItem,
} from "../../tests/builders/order.builder.js";

describe("OrderItem", () => {
  it("computes its line total", () => {
    expect(buildOrderItem({ unitPrice: 25, quantity: 4 }).lineTotal()).toBe(
      100,
    );
  });

  it("rounds its line total to the cent", () => {
    expect(buildOrderItem({ unitPrice: 19.99, quantity: 3 }).lineTotal()).toBe(
      59.97,
    );
  });
});

describe("Order", () => {
  it("knows whether it was placed without an account", () => {
    expect(buildOrder({ userId: null }).isGuestOrder()).toBe(true);
    expect(buildOrder({ userId: "user-1" }).isGuestOrder()).toBe(false);
  });

  it("belongs to its owner only", () => {
    const order = buildOrder({ userId: "user-1" });

    expect(order.isOwnedBy("user-1")).toBe(true);
    expect(order.isOwnedBy("user-2")).toBe(false);
  });

  it("is accessible to its owner and to an administrator", () => {
    const order = buildOrder({ userId: "user-1" });

    expect(order.isAccessibleBy({ userId: "user-1", role: "CLIENT" })).toBe(
      true,
    );
    expect(order.isAccessibleBy({ userId: "admin-1", role: "ADMIN" })).toBe(
      true,
    );
  });

  it("is not accessible to anybody else, staff members included", () => {
    const order = buildOrder({ userId: "user-1" });

    expect(order.isAccessibleBy({ userId: "user-2", role: "CLIENT" })).toBe(
      false,
    );
    expect(order.isAccessibleBy({ userId: "staff-1", role: "STAFF" })).toBe(
      false,
    );
  });

  it("cannot be cancelled while it is awaiting payment", () => {
    const expected: Record<OrderStatus, boolean> = {
      AWAITING_PAYMENT: false,
      PENDING: true,
      READY_FOR_PICKUP: true,
      PICKED_UP: false,
      CANCELLED: false,
    };

    ORDER_STATUSES.forEach((status) => {
      expect(buildOrder({ status }).canBeCancelled()).toBe(expected[status]);
    });
  });

  it("moves from awaiting payment to pending once paid", () => {
    expect(
      buildOrder({ status: "AWAITING_PAYMENT" }).canTransitionTo("PENDING"),
    ).toBe(true);
  });

  it("moves from awaiting payment to cancelled if the payment fails or expires", () => {
    expect(
      buildOrder({ status: "AWAITING_PAYMENT" }).canTransitionTo("CANCELLED"),
    ).toBe(true);
  });

  it("only moves forward, one step at a time, once paid", () => {
    expect(
      buildOrder({ status: "PENDING" }).canTransitionTo("READY_FOR_PICKUP"),
    ).toBe(true);
    expect(
      buildOrder({ status: "READY_FOR_PICKUP" }).canTransitionTo("PICKED_UP"),
    ).toBe(true);
  });

  it("cannot skip a step or move backwards", () => {
    expect(
      buildOrder({ status: "AWAITING_PAYMENT" }).canTransitionTo(
        "READY_FOR_PICKUP",
      ),
    ).toBe(false);
    expect(buildOrder({ status: "PENDING" }).canTransitionTo("PICKED_UP")).toBe(
      false,
    );
    expect(
      buildOrder({ status: "READY_FOR_PICKUP" }).canTransitionTo("PENDING"),
    ).toBe(false);
  });

  it("is final once it is picked up or cancelled", () => {
    ORDER_STATUSES.forEach((target) => {
      expect(buildOrder({ status: "PICKED_UP" }).canTransitionTo(target)).toBe(
        false,
      );
      expect(buildOrder({ status: "CANCELLED" }).canTransitionTo(target)).toBe(
        false,
      );
    });
  });

  it("counts the units it contains", () => {
    const order = buildOrder({
      items: [
        buildOrderItem({ id: "i1", quantity: 2 }),
        buildOrderItem({ id: "i2", quantity: 3 }),
      ],
    });

    expect(order.unitCount()).toBe(5);
  });

  it("returns a new order with the requested status and leaves the original untouched", () => {
    const order = buildOrder({ status: "AWAITING_PAYMENT" });
    const paid = order.withStatus("PENDING");

    expect(paid.status).toBe("PENDING");
    expect(paid.id).toBe(order.id);
    expect(order.status).toBe("AWAITING_PAYMENT");
  });

  it("never carries a Stripe session id or a tracking token", () => {
    const serialized = JSON.parse(JSON.stringify(buildOrder()));

    expect(serialized).not.toHaveProperty("trackingToken");
    expect(serialized).not.toHaveProperty("stripeSessionId");
    expect(serialized).toHaveProperty("customerEmail");
  });
});
