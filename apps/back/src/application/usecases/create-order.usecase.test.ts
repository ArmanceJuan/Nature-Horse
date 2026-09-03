import { createOrderUsecase } from "./create-order.usecase.js";
import { IOrderRepository } from "../../domain/interfaces/order-repository.interface.js";
import { IProductRepository } from "../../domain/interfaces/product-repository.interface.js";
import { Product } from "../../domain/entities/product.entity.js";
import { Order } from "../../domain/entities/order.entity.js";

describe("createOrderUsecase", () => {
  const fakeProduct: Product = {
    id: "p1",
    name: "Test Product",
    description: "desc",
    price: 100,
    collection: "haute-sellerie",
    discipline: "dressage",
    specs: [],
    shippingInfo: "info",
    isNew: false,
    isPopular: false,
    images: [],
    variants: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

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

  const fakeProductRepository: IProductRepository = {
    findAll: async () => [],
    findById: async () => null,
    findByVariantId: async () => fakeProduct,
    create: async () => fakeProduct,
    update: async () => fakeProduct,
    delete: async () => {},
  };

  it("should resolve price and name from the real product, not the input", async () => {
    let receivedData: unknown = null;

    const fakeOrderRepository: IOrderRepository = {
      create: async (data) => {
        receivedData = data;
        return fakeOrder;
      },
      findById: async () => null,
      findByUserId: async () => [],
      findAll: async () => [],
      updateStatus: async () => fakeOrder,
      cancel: async () => fakeOrder,
    };

    const createOrder = createOrderUsecase(
      fakeOrderRepository,
      fakeProductRepository,
    );

    await createOrder({
      userId: "u1",
      storeId: "s1",
      items: [{ productVariantId: "v1", quantity: 2 }],
    });

    expect(receivedData).toMatchObject({
      totalPrice: 200,
      items: [{ productName: "Test Product", unitPrice: 100, quantity: 2 }],
    });
  });

  it("should throw 400 when items array is empty", async () => {
    const fakeOrderRepository: IOrderRepository = {
      create: async () => fakeOrder,
      findById: async () => null,
      findByUserId: async () => [],
      findAll: async () => [],
      updateStatus: async () => fakeOrder,
      cancel: async () => fakeOrder,
    };

    const createOrder = createOrderUsecase(
      fakeOrderRepository,
      fakeProductRepository,
    );

    await expect(
      createOrder({ userId: "u1", storeId: "s1", items: [] }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it("should throw 404 when a variant does not exist", async () => {
    const fakeProductRepoNotFound: IProductRepository = {
      ...fakeProductRepository,
      findByVariantId: async () => null,
    };

    const fakeOrderRepository: IOrderRepository = {
      create: async () => fakeOrder,
      findById: async () => null,
      findByUserId: async () => [],
      findAll: async () => [],
      updateStatus: async () => fakeOrder,
      cancel: async () => fakeOrder,
    };

    const createOrder = createOrderUsecase(
      fakeOrderRepository,
      fakeProductRepoNotFound,
    );

    await expect(
      createOrder({
        userId: "u1",
        storeId: "s1",
        items: [{ productVariantId: "unknown", quantity: 1 }],
      }),
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});
