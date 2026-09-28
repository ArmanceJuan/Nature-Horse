import { UpdateProductValidator } from "./update-product.validator.js";
import { ValidationError } from "../../domain/errors/http-errors.js";

describe("UpdateProductValidator", () => {
  const validator = new UpdateProductValidator();

  it("keeps only the fields that are provided", () => {
    expect(validator.parse({ price: 59.99, isNew: true })).toEqual({
      price: 59.99,
      isNew: true,
    });
  });

  it("drops the fields it does not know", () => {
    expect(validator.parse({ price: 10, status: "ARCHIVED" })).toEqual({
      price: 10,
    });
  });

  it("rejects an update without any field", () => {
    expect(() => validator.parse({})).toThrow(
      "At least one field to update is required",
    );
  });

  it("rejects a price that is not strictly positive", () => {
    expect(() => validator.parse({ price: -3 })).toThrow(
      "Price must be a positive number",
    );
  });

  it("rejects an empty name", () => {
    expect(() => validator.parse({ name: "   " })).toThrow(
      "Name must be a non-empty string",
    );
  });

  it("rejects a body that is not an object", () => {
    expect(() => validator.parse(undefined)).toThrow(ValidationError);
  });
});
