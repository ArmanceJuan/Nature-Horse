import { ConfirmOrderPaymentUseCase } from "./confirm-order-payment.usecase.js";
import { buildOrder } from "../../tests/builders/order.builder.js";
import { InMemoryOrderRepository } from "../../tests/fakes/in-memory-order.repository.js";

describe("ConfirmOrderPaymentUseCase", () => {
  it("moves the order from awaiting payment to pending", async () => {
    const order = buildOrder({ id: "o1", status: "AWAITING_PAYMENT" });
    const repository = new InMemoryOrderRepository([order], {}, null, {
      "session-1": "o1",
    });
    const useCase = new ConfirmOrderPaymentUseCase(repository);

    await useCase.execute("session-1");

    expect((await repository.findById("o1"))?.status).toBe("PENDING");
  });

  it("does nothing for a session that designates no order", async () => {
    const repository = new InMemoryOrderRepository();
    const useCase = new ConfirmOrderPaymentUseCase(repository);

    await expect(useCase.execute("unknown-session")).resolves.toBeUndefined();
  });

  it("stays silent on a replayed webhook for an order already confirmed", async () => {
    const order = buildOrder({ id: "o1", status: "PENDING" });
    const repository = new InMemoryOrderRepository([order], {}, null, {
      "session-1": "o1",
    });
    const useCase = new ConfirmOrderPaymentUseCase(repository);

    await expect(useCase.execute("session-1")).resolves.toBeUndefined();
    expect((await repository.findById("o1"))?.status).toBe("PENDING");
  });
});
