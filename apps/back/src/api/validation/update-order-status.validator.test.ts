import { UpdateOrderStatusValidator } from "./update-order-status.validator.js";
import { ORDER_STATUSES } from "../../domain/entities/order.entity.js";
import { ValidationError } from "../../domain/errors/http-errors.js";

describe("UpdateOrderStatusValidator", () => {
  const validator = new UpdateOrderStatusValidator();

  it("accepts every status of the order lifecycle", () => {
    ORDER_STATUSES.forEach((status) => {
      expect(validator.parse({ status })).toEqual({ status });
    });
  });

  it("drops the fields it does not know", () => {
    expect(validator.parse({ status: "PICKED_UP", userId: "forced" })).toEqual({
      status: "PICKED_UP",
    });
  });

  it("rejects an unknown status", () => {
    expect(() => validator.parse({ status: "SHIPPED" })).toThrow(
      ValidationError,
    );
  });

  it("rejects a status that is not text or missing", () => {
    expect(() => validator.parse({ status: 1 })).toThrow(ValidationError);
    expect(() => validator.parse({})).toThrow(ValidationError);
  });

  it("rejects a body that is not an object", () => {
    expect(() => validator.parse(undefined)).toThrow(ValidationError);
  });
});
