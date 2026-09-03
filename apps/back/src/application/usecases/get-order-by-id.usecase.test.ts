import { getOrderByIdUsecase } from "./get-order-by-id.usecase.js";
import { IOrderRepository } from "../../domain/interfaces/order-repository.interface.js";
import { Order } from "../../domain/entities/order.entity.js";

describe("getOrderByIdUsecase", () => {
  const fakeOrder: Order = {
    id: "o1",
    userId: "owner-id",
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
    updateStatus: async () => fakeOrder,
    cancel: async () => fakeOrder,
  };

  it("should return the order when requested by its owner", async () => {
    const getOrderById = getOrderByIdUsecase(fakeRepository);
    const result = await getOrderById("o1", "owner-id", false);

    expect(result).toEqual(fakeOrder);
  });

  it("should return the order when requested by an admin", async () => {
    const getOrderById = getOrderByIdUsecase(fakeRepository);
    const result = await getOrderById("o1", "someone-else", true);

    expect(result).toEqual(fakeOrder);
  });

  it("should throw 403 when requested by a non-owner, non-admin user", async () => {
    const getOrderById = getOrderByIdUsecase(fakeRepository);

    await expect(
      getOrderById("o1", "someone-else", false),
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it("should throw 404 when order does not exist", async () => {
    const repoWithNoOrder: IOrderRepository = {
      ...fakeRepository,
      findById: async () => null,
    };
    const getOrderById = getOrderByIdUsecase(repoWithNoOrder);

    await expect(
      getOrderById("unknown", "owner-id", false),
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});
