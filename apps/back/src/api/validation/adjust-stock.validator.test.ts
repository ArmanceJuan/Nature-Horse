import { AdjustStockValidator } from "./adjust-stock.validator.js";
import { ValidationError } from "../../domain/errors/http-errors.js";

describe("AdjustStockValidator", () => {
  const validator = new AdjustStockValidator();

  it("accepts a store and an integer quantity", () => {
    expect(validator.parse({ storeId: "store-1", quantity: 12 })).toEqual({
      storeId: "store-1",
      quantity: 12,
    });
  });

  it("accepts a quantity of zero", () => {
    expect(validator.parse({ storeId: "store-1", quantity: 0 }).quantity).toBe(
      0,
    );
  });

  it("drops the fields it does not know", () => {
    expect(
      validator.parse({ storeId: "store-1", quantity: 3, price: 1 }),
    ).toEqual({ storeId: "store-1", quantity: 3 });
  });

  it("rejects a negative quantity", () => {
    expect(() => validator.parse({ storeId: "store-1", quantity: -1 })).toThrow(
      ValidationError,
    );
  });

  it("rejects a quantity that is not an integer", () => {
    expect(() =>
      validator.parse({ storeId: "store-1", quantity: 2.5 }),
    ).toThrow(ValidationError);
  });

  it("rejects a quantity given as text", () => {
    expect(() =>
      validator.parse({ storeId: "store-1", quantity: "5" }),
    ).toThrow(ValidationError);
  });

  it("rejects a quantity above the maximum", () => {
    expect(() =>
      validator.parse({ storeId: "store-1", quantity: 100001 }),
    ).toThrow(ValidationError);
  });

  it("rejects a missing store", () => {
    expect(() => validator.parse({ quantity: 3 })).toThrow(
      "storeId is required",
    );
  });
});
