import { GetAllOrdersUseCase } from "./get-all-orders.usecase.js";
import { buildOrder } from "../../tests/builders/order.builder.js";
import { InMemoryOrderRepository } from "../../tests/fakes/in-memory-order.repository.js";

describe("GetAllOrdersUseCase", () => {
  it("returns every order, guests included", async () => {
    const orders = [
      buildOrder({ id: "o1", userId: "user-1" }),
      buildOrder({ id: "o2", userId: null }),
    ];
    const useCase = new GetAllOrdersUseCase(
      new InMemoryOrderRepository(orders),
    );

    expect(await useCase.execute()).toEqual(orders);
  });

  it("returns an empty list when there is no order", async () => {
    const useCase = new GetAllOrdersUseCase(new InMemoryOrderRepository());

    expect(await useCase.execute()).toEqual([]);
  });
});
