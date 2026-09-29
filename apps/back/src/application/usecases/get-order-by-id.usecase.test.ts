import { GetOrderByIdUseCase } from "./get-order-by-id.usecase.js";
import {
  ForbiddenError,
  NotFoundError,
} from "../../domain/errors/http-errors.js";
import { buildOrder } from "../../tests/builders/order.builder.js";
import { InMemoryOrderRepository } from "../../tests/fakes/in-memory-order.repository.js";

describe("GetOrderByIdUseCase", () => {
  const order = buildOrder({ id: "o1", userId: "owner-id" });
  const guestOrder = buildOrder({ id: "o2", userId: null });
  const useCase = new GetOrderByIdUseCase(
    new InMemoryOrderRepository([order, guestOrder]),
  );

  it("returns the order to its owner", async () => {
    expect(
      await useCase.execute("o1", { userId: "owner-id", role: "CLIENT" }),
    ).toEqual(order);
  });

  it("returns the order to an administrator", async () => {
    expect(
      await useCase.execute("o1", { userId: "admin-id", role: "ADMIN" }),
    ).toEqual(order);
  });

  it("refuses a user who is neither the owner nor an administrator", async () => {
    await expect(
      useCase.execute("o1", { userId: "someone-else", role: "CLIENT" }),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("refuses a staff member as well", async () => {
    await expect(
      useCase.execute("o1", { userId: "staff-id", role: "STAFF" }),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("does not show a guest order to a logged-in customer", async () => {
    await expect(
      useCase.execute("o2", { userId: "someone", role: "CLIENT" }),
    ).rejects.toMatchObject({
      statusCode: 403,
    });
  });

  it("shows a guest order to an administrator", async () => {
    expect(
      await useCase.execute("o2", { userId: "admin-id", role: "ADMIN" }),
    ).toEqual(guestOrder);
  });

  it("throws a NotFoundError for an unknown order", async () => {
    await expect(
      useCase.execute("ghost", { userId: "owner-id", role: "CLIENT" }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
