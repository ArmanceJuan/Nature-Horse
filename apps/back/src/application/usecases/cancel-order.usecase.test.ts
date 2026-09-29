import { CancelOrderUseCase } from "./cancel-order.usecase.js";
import type { OrderStatus } from "../../domain/entities/order.entity.js";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../../domain/errors/http-errors.js";
import { buildOrder } from "../../tests/builders/order.builder.js";
import { InMemoryOrderRepository } from "../../tests/fakes/in-memory-order.repository.js";

const build = (status: OrderStatus = "PENDING") => {
  const repository = new InMemoryOrderRepository([
    buildOrder({ id: "o1", userId: "owner-id", status }),
    buildOrder({ id: "o2", userId: null, status }),
  ]);

  return { repository, useCase: new CancelOrderUseCase(repository) };
};

const owner = { userId: "owner-id", role: "CLIENT" as const };
const admin = { userId: "admin-id", role: "ADMIN" as const };
const stranger = { userId: "stranger-id", role: "CLIENT" as const };

describe("CancelOrderUseCase", () => {
  it("lets the owner cancel a pending order", async () => {
    const { repository, useCase } = build("PENDING");

    const result = await useCase.execute("o1", owner);

    expect(result.status).toBe("CANCELLED");
    expect(repository.cancelledIds).toEqual(["o1"]);
  });

  it("lets the owner cancel an order that is ready for pickup", async () => {
    const { useCase } = build("READY_FOR_PICKUP");

    expect((await useCase.execute("o1", owner)).status).toBe("CANCELLED");
  });

  it("lets an administrator cancel the order of a customer", async () => {
    const { useCase } = build();

    expect((await useCase.execute("o1", admin)).status).toBe("CANCELLED");
  });

  it("lets an administrator cancel a guest order", async () => {
    const { useCase } = build();

    expect((await useCase.execute("o2", admin)).status).toBe("CANCELLED");
  });

  it("refuses another customer and leaves the order untouched", async () => {
    const { repository, useCase } = build();

    await expect(useCase.execute("o1", stranger)).rejects.toBeInstanceOf(
      ForbiddenError,
    );
    expect(repository.cancelledIds).toEqual([]);
  });

  it("refuses a logged-in customer for a guest order", async () => {
    const { useCase } = build();

    await expect(useCase.execute("o2", stranger)).rejects.toBeInstanceOf(
      ForbiddenError,
    );
  });

  it("refuses to cancel an order that was picked up", async () => {
    const { repository, useCase } = build("PICKED_UP");

    await expect(useCase.execute("o1", owner)).rejects.toBeInstanceOf(
      ConflictError,
    );
    expect(repository.cancelledIds).toEqual([]);
  });

  it("refuses to cancel an order twice", async () => {
    const { useCase } = build("CANCELLED");

    await expect(useCase.execute("o1", owner)).rejects.toBeInstanceOf(
      ConflictError,
    );
  });

  it("throws a NotFoundError for an unknown order", async () => {
    const { useCase } = build();

    await expect(useCase.execute("ghost", owner)).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
