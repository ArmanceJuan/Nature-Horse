import { CancelOrderByTrackingTokenUseCase } from "./cancel-order-by-tracking-token.usecase.js";
import { GetOrderByTrackingTokenUseCase } from "./get-order-by-tracking-token.usecase.js";
import type { OrderStatus } from "../../domain/entities/order.entity.js";
import {
  ConflictError,
  NotFoundError,
} from "../../domain/errors/http-errors.js";
import { buildOrder } from "../../tests/builders/order.builder.js";
import { InMemoryOrderRepository } from "../../tests/fakes/in-memory-order.repository.js";

const TOKEN = "a".repeat(64);

const build = (status: OrderStatus = "PENDING") => {
  const repository = new InMemoryOrderRepository(
    [buildOrder({ id: "o1", userId: null, status })],
    { [TOKEN]: "o1" },
  );

  return {
    repository,
    useCase: new CancelOrderByTrackingTokenUseCase(
      new GetOrderByTrackingTokenUseCase(repository),
      repository,
    ),
  };
};

describe("CancelOrderByTrackingTokenUseCase", () => {
  it("cancels the order designated by the token", async () => {
    const { repository, useCase } = build();

    const result = await useCase.execute(TOKEN);

    expect(result.status).toBe("CANCELLED");
    expect(repository.cancelledIds).toEqual(["o1"]);
  });

  it("refuses to cancel an order that was picked up", async () => {
    const { repository, useCase } = build("PICKED_UP");

    await expect(useCase.execute(TOKEN)).rejects.toBeInstanceOf(ConflictError);
    expect(repository.cancelledIds).toEqual([]);
  });

  it("refuses to cancel an order twice", async () => {
    const { useCase } = build();

    await useCase.execute(TOKEN);

    await expect(useCase.execute(TOKEN)).rejects.toBeInstanceOf(ConflictError);
  });

  it("throws a NotFoundError for a token that designates nothing", async () => {
    const { repository, useCase } = build();

    await expect(useCase.execute("b".repeat(64))).rejects.toBeInstanceOf(
      NotFoundError,
    );
    expect(repository.cancelledIds).toEqual([]);
  });

  it("throws a NotFoundError for a token that is not well formed", async () => {
    const { useCase } = build();

    await expect(useCase.execute("not-a-token")).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
