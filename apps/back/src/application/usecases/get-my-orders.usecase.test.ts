import { GetMyOrdersUseCase } from "./get-my-orders.usecase.js";
import { buildOrder } from "../../tests/builders/order.builder.js";
import { InMemoryOrderRepository } from "../../tests/fakes/in-memory-order.repository.js";

describe("GetMyOrdersUseCase", () => {
  const mine = buildOrder({ id: "o1", userId: "user-1" });
  const other = buildOrder({ id: "o2", userId: "user-2" });
  const guestOrder = buildOrder({ id: "o3", userId: null });
  const useCase = new GetMyOrdersUseCase(
    new InMemoryOrderRepository([mine, other, guestOrder]),
  );

  it("returns only the orders of the user", async () => {
    expect(await useCase.execute("user-1")).toEqual([mine]);
  });

  it("returns an empty list for a user without order", async () => {
    expect(await useCase.execute("user-3")).toEqual([]);
  });
});
