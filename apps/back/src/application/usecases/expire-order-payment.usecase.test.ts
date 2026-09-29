import { ExpireOrderPaymentUseCase } from "./expire-order-payment.usecase.js";
import {
  buildOrder,
  buildOrderItem,
} from "../../tests/builders/order.builder.js";
import {
  buildProduct,
  buildVariant,
} from "../../tests/builders/product.builder.js";
import { InMemoryOrderRepository } from "../../tests/fakes/in-memory-order.repository.js";
import { InMemoryProductRepository } from "../../tests/fakes/in-memory-product.repository.js";

describe("ExpireOrderPaymentUseCase", () => {
  it("cancels the order and restores the stock", async () => {
    const products = new InMemoryProductRepository([
      buildProduct({
        id: "p1",
        variants: [buildVariant({ id: "v1", stockByStore: { "store-1": 3 } })],
      }),
    ]);
    const order = buildOrder({
      id: "o1",
      status: "AWAITING_PAYMENT",
      storeId: "store-1",
      items: [buildOrderItem({ productVariantId: "v1", quantity: 2 })],
    });
    const orders = new InMemoryOrderRepository([order], {}, products, {
      "session-1": "o1",
    });
    const useCase = new ExpireOrderPaymentUseCase(orders);

    await useCase.execute("session-1");

    expect((await orders.findById("o1"))?.status).toBe("CANCELLED");
    expect(
      (await products.findByVariantId("v1"))?.variants[0].stockInStore(
        "store-1",
      ),
    ).toBe(5);
  });

  it("does nothing for a session that designates no order", async () => {
    const useCase = new ExpireOrderPaymentUseCase(
      new InMemoryOrderRepository(),
    );

    await expect(useCase.execute("unknown-session")).resolves.toBeUndefined();
  });

  it("stays silent on a replayed webhook for an order already paid", async () => {
    const order = buildOrder({ id: "o1", status: "PENDING" });
    const repository = new InMemoryOrderRepository([order], {}, null, {
      "session-1": "o1",
    });
    const useCase = new ExpireOrderPaymentUseCase(repository);

    await expect(useCase.execute("session-1")).resolves.toBeUndefined();
    expect((await repository.findById("o1"))?.status).toBe("PENDING");
  });
});
