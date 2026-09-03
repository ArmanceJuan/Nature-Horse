import { updateOrderStatusUsecase } from "./update-order-status.usecase.js";
import { IOrderRepository } from "../../domain/interfaces/order-repository.interface.js";
import { Order } from "../../domain/entities/order.entity.js";

describe("updateOrderStatusUsecase", () => {
  const fakeOrder: Order = {
    id: "o1",
    userId: "u1",
    storeId: "s1",
    status: "PENDING",
    totalPrice: 100,
    items: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const fakeRepository: IOrderRepository = {
    create: async () => fakeOrder,
    findById: async () => fakeOrder,
    findByUserId: async () => [],
    findAll: async () => [],
    updateStatus: async (id, status) => ({ ...fakeOrder, status }),
    cancel: async () => fakeOrder,
  };

  it("should update to a valid status", async () => {
    const updateOrderStatus = updateOrderStatusUsecase(fakeRepository);
    const result = await updateOrderStatus("o1", "READY_FOR_PICKUP");

    expect(result.status).toBe("READY_FOR_PICKUP");
  });

  it("should reject CANCELLED (must use the cancel endpoint instead)", async () => {
    const updateOrderStatus = updateOrderStatusUsecase(fakeRepository);

    await expect(updateOrderStatus("o1", "CANCELLED")).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  it("should throw 404 when order does not exist", async () => {
    const repoWithNoOrder: IOrderRepository = {
      ...fakeRepository,
      findById: async () => null,
    };
    const updateOrderStatus = updateOrderStatusUsecase(repoWithNoOrder);

    await expect(
      updateOrderStatus("unknown", "PICKED_UP"),
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});
