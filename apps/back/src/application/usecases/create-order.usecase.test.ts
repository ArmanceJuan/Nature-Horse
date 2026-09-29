import { CreateOrderUseCase } from "./create-order.usecase.js";
import type { Product } from "../../domain/entities/product.entity.js";
import type { User } from "../../domain/entities/user.entity.js";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../../domain/errors/http-errors.js";
import {
  buildProduct,
  buildVariant,
} from "../../tests/builders/product.builder.js";
import { buildStore } from "../../tests/builders/store.builder.js";
import { buildUser } from "../../tests/builders/user.builder.js";
import { FakeTrackingTokenGenerator } from "../../tests/fakes/fake-tracking-token.generator.js";
import { FixedClock } from "../../tests/fakes/fixed-clock.js";
import { InMemoryOrderRepository } from "../../tests/fakes/in-memory-order.repository.js";
import { InMemoryProductRepository } from "../../tests/fakes/in-memory-product.repository.js";
import { InMemoryStoreRepository } from "../../tests/fakes/in-memory-store.repository.js";
import { InMemoryUserRepository } from "../../tests/fakes/in-memory-user.repository.js";

const NOW = new Date("2026-10-01T10:00:00.000Z");

const defaultProducts = (): Product[] => [
  buildProduct({
    id: "p1",
    name: "Selle",
    price: 100,
    variants: [buildVariant({ id: "v1" })],
  }),
  buildProduct({
    id: "p2",
    name: "Gants",
    price: 19.99,
    variants: [buildVariant({ id: "v2" })],
  }),
];

const defaultUsers = (): User[] => [
  buildUser({
    id: "user-1",
    email: "Client@Example.com",
    firstName: "Jean",
    lastName: "Dupont",
    phone: "0612345678",
  }),
];

const build = (options: { products?: Product[]; users?: User[] } = {}) => {
  const orders = new InMemoryOrderRepository();

  const useCase = new CreateOrderUseCase(
    orders,
    new InMemoryProductRepository(options.products ?? defaultProducts()),
    new InMemoryStoreRepository([buildStore({ id: "store-1" })]),
    new InMemoryUserRepository(options.users ?? defaultUsers()),
    new FakeTrackingTokenGenerator(),
    new FixedClock(NOW),
  );

  return { orders, useCase };
};

const guest = {
  email: "  Marie@Example.COM ",
  firstName: " Marie ",
  lastName: " Martin ",
  phone: " 0611223344 ",
};

describe("CreateOrderUseCase", () => {
  it("uses the identity of the account and the real price for a logged-in customer", async () => {
    const { orders, useCase } = build();

    await useCase.execute({
      userId: "user-1",
      storeId: "store-1",
      items: [{ productVariantId: "v1", quantity: 2 }],
    });

    expect(orders.createdData[0]).toMatchObject({
      userId: "user-1",
      storeId: "store-1",
      customerEmail: "client@example.com",
      customerFirstName: "Jean",
      customerLastName: "Dupont",
      customerPhone: "0612345678",
      totalPrice: 200,
      items: [
        {
          productVariantId: "v1",
          productName: "Selle",
          quantity: 2,
          unitPrice: 100,
        },
      ],
    });
  });

  it("ignores guest details when the customer is logged in", async () => {
    const { orders, useCase } = build();

    await useCase.execute({
      userId: "user-1",
      storeId: "store-1",
      guest,
      items: [{ productVariantId: "v1", quantity: 1 }],
    });

    expect(orders.createdData[0].customerEmail).toBe("client@example.com");
    expect(orders.createdData[0].customerFirstName).toBe("Jean");
  });

  it("links the order to no account and normalizes the details of a guest", async () => {
    const { orders, useCase } = build();

    await useCase.execute({
      userId: null,
      storeId: "store-1",
      guest,
      items: [{ productVariantId: "v1", quantity: 1 }],
    });

    expect(orders.createdData[0]).toMatchObject({
      userId: null,
      customerEmail: "marie@example.com",
      customerFirstName: "Marie",
      customerLastName: "Martin",
      customerPhone: "0611223344",
    });
  });

  it("stores no phone number for a guest who gave none", async () => {
    const { orders, useCase } = build();

    await useCase.execute({
      userId: null,
      storeId: "store-1",
      guest: {
        email: "marie@example.com",
        firstName: "Marie",
        lastName: "Martin",
      },
      items: [{ productVariantId: "v1", quantity: 1 }],
    });

    expect(orders.createdData[0].customerPhone).toBeNull();
  });

  it("returns the order together with the tracking token, which the order itself does not carry", async () => {
    const { orders, useCase } = build();

    const result = await useCase.execute({
      userId: null,
      storeId: "store-1",
      guest,
      items: [{ productVariantId: "v1", quantity: 1 }],
    });

    expect(result.trackingToken.value).toBe("0".repeat(63) + "1");
    expect(orders.createdData[0].trackingToken.value).toBe(
      result.trackingToken.value,
    );
    expect(result.order).not.toHaveProperty("trackingToken");
  });

  it("makes the order available for pickup one hour after its creation", async () => {
    const { orders, useCase } = build();

    await useCase.execute({
      userId: null,
      storeId: "store-1",
      guest,
      items: [{ productVariantId: "v1", quantity: 1 }],
    });

    expect(orders.createdData[0].pickupReadyAt.toISOString()).toBe(
      "2026-10-01T11:00:00.000Z",
    );
  });

  it("merges the lines that designate the same variant", async () => {
    const { orders, useCase } = build();

    await useCase.execute({
      userId: "user-1",
      storeId: "store-1",
      items: [
        { productVariantId: "v1", quantity: 1 },
        { productVariantId: "v1", quantity: 2 },
      ],
    });

    expect(orders.createdData[0].items).toHaveLength(1);
    expect(orders.createdData[0].items[0].quantity).toBe(3);
    expect(orders.createdData[0].totalPrice).toBe(300);
  });

  it("computes the total to the cent", async () => {
    const { orders, useCase } = build();

    await useCase.execute({
      userId: "user-1",
      storeId: "store-1",
      items: [
        { productVariantId: "v1", quantity: 1 },
        { productVariantId: "v2", quantity: 3 },
      ],
    });

    expect(orders.createdData[0].totalPrice).toBe(159.97);
  });

  it("refuses an order without any item", async () => {
    const { orders, useCase } = build();

    await expect(
      useCase.execute({ userId: "user-1", storeId: "store-1", items: [] }),
    ).rejects.toBeInstanceOf(ValidationError);
    expect(orders.createdData).toEqual([]);
  });

  it("refuses a quantity that is not a positive integer", async () => {
    const { useCase } = build();

    for (const quantity of [0, -1, 1.5]) {
      await expect(
        useCase.execute({
          userId: "user-1",
          storeId: "store-1",
          items: [{ productVariantId: "v1", quantity }],
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    }
  });

  it("refuses a line that exceeds the maximum once its duplicates are merged", async () => {
    const { orders, useCase } = build();

    await expect(
      useCase.execute({
        userId: "user-1",
        storeId: "store-1",
        items: [
          { productVariantId: "v1", quantity: 60 },
          { productVariantId: "v1", quantity: 60 },
        ],
      }),
    ).rejects.toBeInstanceOf(ValidationError);
    expect(orders.createdData).toEqual([]);
  });

  it("asks a visitor for her details", async () => {
    const { orders, useCase } = build();

    await expect(
      useCase.execute({
        userId: null,
        storeId: "store-1",
        items: [{ productVariantId: "v1", quantity: 1 }],
      }),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Customer details are required to order without an account",
    });
    expect(orders.createdData).toEqual([]);
  });

  it("refuses guest details with an invalid email", async () => {
    const { useCase } = build();

    await expect(
      useCase.execute({
        userId: null,
        storeId: "store-1",
        guest: {
          email: "not-an-email",
          firstName: "Marie",
          lastName: "Martin",
        },
        items: [{ productVariantId: "v1", quantity: 1 }],
      }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("refuses an unknown user", async () => {
    const { useCase } = build();

    await expect(
      useCase.execute({
        userId: "ghost",
        storeId: "store-1",
        items: [{ productVariantId: "v1", quantity: 1 }],
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("refuses an unknown store", async () => {
    const { orders, useCase } = build();

    await expect(
      useCase.execute({
        userId: "user-1",
        storeId: "ghost",
        items: [{ productVariantId: "v1", quantity: 1 }],
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(orders.createdData).toEqual([]);
  });

  it("refuses an unknown variant", async () => {
    const { orders, useCase } = build();

    await expect(
      useCase.execute({
        userId: "user-1",
        storeId: "store-1",
        items: [{ productVariantId: "ghost", quantity: 1 }],
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(orders.createdData).toEqual([]);
  });

  it("refuses a product that has been archived", async () => {
    const { orders, useCase } = build({
      products: [
        buildProduct({
          id: "p1",
          status: "ARCHIVED",
          variants: [buildVariant({ id: "v1" })],
        }),
      ],
    });

    await expect(
      useCase.execute({
        userId: "user-1",
        storeId: "store-1",
        items: [{ productVariantId: "v1", quantity: 1 }],
      }),
    ).rejects.toBeInstanceOf(ConflictError);
    expect(orders.createdData).toEqual([]);
  });
});
