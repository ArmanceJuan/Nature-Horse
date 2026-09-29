import { UpdateOrderStatusUseCase } from "./update-order-status.usecase.js";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../domain/errors/http-errors.js";
import type { OrderStatus } from "../../domain/entities/order.entity.js";
import { buildOrder } from "../../tests/builders/order.builder.js";
import { InMemoryOrderRepository } from "../../tests/fakes/in-memory-order.repository.js";

const build = (status: OrderStatus) => {
  const repository = new InMemoryOrderRepository([
    buildOrder({ id: "o1", status }),
  ]);

  return { repository, useCase: new UpdateOrderStatusUseCase(repository) };
};

describe("UpdateOrderStatusUseCase", () => {
  it("moves a pending order to ready for pickup", async () => {
    const { repository, useCase } = build("PENDING");

    const result = await useCase.execute("o1", "READY_FOR_PICKUP");

    expect(result.status).toBe("READY_FOR_PICKUP");
    expect((await repository.findById("o1"))?.status).toBe("READY_FOR_PICKUP");
  });

  it("moves an order that is ready to picked up", async () => {
    const { useCase } = build("READY_FOR_PICKUP");

    expect((await useCase.execute("o1", "PICKED_UP")).status).toBe("PICKED_UP");
  });

  it("rejects a cancellation, which has its own endpoint", async () => {
    const { repository, useCase } = build("PENDING");

    await expect(useCase.execute("o1", "CANCELLED")).rejects.toBeInstanceOf(
      ValidationError,
    );
    expect((await repository.findById("o1"))?.status).toBe("PENDING");
  });

  it("rejects a transition that skips a step", async () => {
    const { useCase } = build("PENDING");

    await expect(useCase.execute("o1", "PICKED_UP")).rejects.toBeInstanceOf(
      ConflictError,
    );
  });

  it("rejects a transition that goes backwards", async () => {
    const { useCase } = build("READY_FOR_PICKUP");

    await expect(useCase.execute("o1", "PENDING")).rejects.toBeInstanceOf(
      ConflictError,
    );
  });

  it("does not change an order that is already picked up or cancelled", async () => {
    for (const status of ["PICKED_UP", "CANCELLED"] as OrderStatus[]) {
      const { useCase } = build(status);

      await expect(
        useCase.execute("o1", "READY_FOR_PICKUP"),
      ).rejects.toBeInstanceOf(ConflictError);
    }
  });

  it("throws a NotFoundError for an unknown order", async () => {
    const { useCase } = build("PENDING");

    await expect(
      useCase.execute("ghost", "READY_FOR_PICKUP"),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
  it("refuses to manually change the status of an order awaiting payment", async () => {
    const { useCase } = build("AWAITING_PAYMENT");

    await expect(useCase.execute("o1", "PENDING")).rejects.toBeInstanceOf(
      ConflictError,
    );
  });
});
