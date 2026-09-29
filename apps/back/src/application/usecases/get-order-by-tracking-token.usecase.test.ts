import { GetOrderByTrackingTokenUseCase } from "./get-order-by-tracking-token.usecase.js";
import { NotFoundError } from "../../domain/errors/http-errors.js";
import { buildOrder } from "../../tests/builders/order.builder.js";
import { InMemoryOrderRepository } from "../../tests/fakes/in-memory-order.repository.js";

const TOKEN = "a".repeat(64);

describe("GetOrderByTrackingTokenUseCase", () => {
  const order = buildOrder({ id: "o1", userId: null });
  const useCase = new GetOrderByTrackingTokenUseCase(
    new InMemoryOrderRepository([order], { [TOKEN]: "o1" }),
  );

  it("returns the order designated by its tracking token", async () => {
    expect(await useCase.execute(TOKEN)).toEqual(order);
  });

  it("throws a NotFoundError for a token that designates nothing", async () => {
    await expect(useCase.execute("b".repeat(64))).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("throws a NotFoundError for a token that is not even well formed", async () => {
    await expect(useCase.execute("not-a-token")).rejects.toBeInstanceOf(
      NotFoundError,
    );
    await expect(useCase.execute("")).rejects.toBeInstanceOf(NotFoundError);
  });
});
