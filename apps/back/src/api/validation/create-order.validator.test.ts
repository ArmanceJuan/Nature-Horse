import { CreateOrderValidator } from "./create-order.validator.js";
import { ValidationError } from "../../domain/errors/http-errors.js";

const validPayload = () => ({
  storeId: "isle-sur-la-sorgue",
  customer: {
    email: " marie@example.com ",
    firstName: " Marie ",
    lastName: "Martin",
    phone: " 06 11 22 33 44 ",
  },
  items: [{ productVariantId: " variant-1 ", quantity: 2 }],
});

describe("CreateOrderValidator", () => {
  const validator = new CreateOrderValidator();

  it("accepts a guest order and trims what must be", () => {
    const body = validator.parse(validPayload());

    expect(body.storeId).toBe("isle-sur-la-sorgue");
    expect(body.customer).toEqual({
      email: "marie@example.com",
      firstName: "Marie",
      lastName: "Martin",
      phone: "06 11 22 33 44",
    });
    expect(body.items).toEqual([
      { productVariantId: "variant-1", quantity: 2 },
    ]);
  });

  it("accepts an order without customer details, for a logged-in customer", () => {
    const { customer, ...withoutCustomer } = validPayload();

    const body = validator.parse(withoutCustomer);

    expect(customer).toBeDefined();
    expect(body).not.toHaveProperty("customer");
  });

  it("treats a null customer as absent", () => {
    expect(
      validator.parse({ ...validPayload(), customer: null }),
    ).not.toHaveProperty("customer");
  });

  it("does not require a phone number", () => {
    const payload = validPayload();
    const { phone, ...customer } = payload.customer;

    const body = validator.parse({ ...payload, customer });

    expect(phone).toBeDefined();
    expect(body.customer).not.toHaveProperty("phone");
  });

  it("drops every field it does not know, so nobody can impose an owner, a price or a status", () => {
    const payload = {
      ...validPayload(),
      userId: "forced",
      status: "PICKED_UP",
      totalPrice: 1,
      trackingToken: "forced",
      items: [{ productVariantId: "variant-1", quantity: 1, unitPrice: 0.01 }],
    };

    const body = validator.parse(payload);

    expect(body).not.toHaveProperty("userId");
    expect(body).not.toHaveProperty("status");
    expect(body).not.toHaveProperty("totalPrice");
    expect(body).not.toHaveProperty("trackingToken");
    expect(body.items[0]).toEqual({
      productVariantId: "variant-1",
      quantity: 1,
    });
  });

  it("rejects a body that is not an object", () => {
    expect(() => validator.parse(null)).toThrow(ValidationError);
    expect(() => validator.parse("nope")).toThrow(ValidationError);
    expect(() => validator.parse([])).toThrow(ValidationError);
  });

  it("rejects a missing store", () => {
    const { storeId, ...withoutStore } = validPayload();

    expect(storeId).toBeDefined();
    expect(() => validator.parse(withoutStore)).toThrow("storeId is required");
  });

  it("rejects an order without item", () => {
    expect(() => validator.parse({ ...validPayload(), items: [] })).toThrow(
      "At least one item is required",
    );
    expect(() => validator.parse({ ...validPayload(), items: "nope" })).toThrow(
      "At least one item is required",
    );
  });

  it("rejects an order with too many lines", () => {
    const items = Array.from({ length: 51 }, (_, index) => ({
      productVariantId: `variant-${index}`,
      quantity: 1,
    }));

    expect(() => validator.parse({ ...validPayload(), items })).toThrow(
      "cannot contain more than 50 lines",
    );
  });

  it("rejects an item without variant", () => {
    expect(() =>
      validator.parse({ ...validPayload(), items: [{ quantity: 1 }] }),
    ).toThrow(ValidationError);
    expect(() =>
      validator.parse({
        ...validPayload(),
        items: [{ productVariantId: "  ", quantity: 1 }],
      }),
    ).toThrow(ValidationError);
  });

  it("rejects a quantity that is not an integer between 1 and 100", () => {
    [0, -1, 101, 1.5, "2", null].forEach((quantity) => {
      expect(() =>
        validator.parse({
          ...validPayload(),
          items: [{ productVariantId: "variant-1", quantity }],
        }),
      ).toThrow(ValidationError);
    });
  });

  it("accepts the boundaries of the quantity", () => {
    expect(
      validator.parse({
        ...validPayload(),
        items: [{ productVariantId: "variant-1", quantity: 100 }],
      }).items[0].quantity,
    ).toBe(100);
    expect(
      validator.parse({
        ...validPayload(),
        items: [{ productVariantId: "variant-1", quantity: 1 }],
      }).items[0].quantity,
    ).toBe(1);
  });

  it("rejects an item that is not an object", () => {
    expect(() =>
      validator.parse({ ...validPayload(), items: ["variant-1"] }),
    ).toThrow(ValidationError);
  });

  it("rejects an email that is not valid", () => {
    const payload = validPayload();

    expect(() =>
      validator.parse({
        ...payload,
        customer: { ...payload.customer, email: "nope" },
      }),
    ).toThrow("A valid email is required");
  });

  it("rejects missing names", () => {
    const payload = validPayload();

    expect(() =>
      validator.parse({
        ...payload,
        customer: { ...payload.customer, firstName: " " },
      }),
    ).toThrow("First name is required");
    expect(() =>
      validator.parse({
        ...payload,
        customer: { ...payload.customer, lastName: undefined },
      }),
    ).toThrow("Last name is required");
  });

  it("rejects a phone number that is not valid", () => {
    const payload = validPayload();

    expect(() =>
      validator.parse({
        ...payload,
        customer: { ...payload.customer, phone: "abc" },
      }),
    ).toThrow("Phone number is invalid");
  });

  it("rejects customer details that are not an object", () => {
    expect(() =>
      validator.parse({ ...validPayload(), customer: "Marie" }),
    ).toThrow("Customer details are invalid");
  });

  it("reports every problem at once", () => {
    try {
      validator.parse({ customer: {}, items: [] });
      throw new Error("The validator should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect((error as ValidationError).message).toContain(
        "storeId is required",
      );
      expect((error as ValidationError).message).toContain(
        "At least one item is required",
      );
      expect((error as ValidationError).message).toContain(
        "A valid email is required",
      );
    }
  });
});
