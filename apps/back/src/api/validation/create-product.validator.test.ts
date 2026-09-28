import { CreateProductValidator } from "./create-product.validator.js";
import { ValidationError } from "../../domain/errors/http-errors.js";

const validPayload = () => ({
  name: "  Selle  ",
  description: "Une selle",
  price: 100,
  collection: "haute-sellerie",
  discipline: "dressage",
  categoryId: "category-1",
  specs: ["Cuir", "  "],
  shippingInfo: "Click & collect",
  isNew: false,
  isPopular: true,
  images: [{ url: "https://example.com/selle.jpg" }],
  variants: [
    {
      attributes: [{ attributeName: "Taille", value: "M" }],
      stockByStore: { "store-1": 2 },
    },
  ],
});

describe("CreateProductValidator", () => {
  const validator = new CreateProductValidator();

  it("accepts a complete payload and trims its text", () => {
    const input = validator.parse(validPayload());

    expect(input.name).toBe("Selle");
    expect(input.specs).toEqual(["Cuir"]);
    expect(input.variants[0].stockByStore).toEqual({ "store-1": 2 });
  });

  it("drops the fields it does not know", () => {
    const input = validator.parse({
      ...validPayload(),
      status: "ARCHIVED",
      id: "forced",
    });

    expect(input).not.toHaveProperty("status");
    expect(input).not.toHaveProperty("id");
  });

  it("rejects a body that is not an object", () => {
    expect(() => validator.parse("nope")).toThrow(ValidationError);
    expect(() => validator.parse(null)).toThrow(ValidationError);
    expect(() => validator.parse([])).toThrow(ValidationError);
  });

  it("rejects a payload without category", () => {
    const { categoryId, ...withoutCategory } = validPayload();

    expect(categoryId).toBeDefined();
    expect(() => validator.parse(withoutCategory)).toThrow(
      "Category is required",
    );
  });

  it("rejects a price that is not strictly positive", () => {
    expect(() => validator.parse({ ...validPayload(), price: 0 })).toThrow(
      "Price must be a positive number",
    );
    expect(() => validator.parse({ ...validPayload(), price: "12" })).toThrow(
      "Price must be a positive number",
    );
  });

  it("rejects an image that is not an http address", () => {
    const payload = {
      ...validPayload(),
      images: [{ url: "javascript:alert(1)" }],
    };

    expect(() => validator.parse(payload)).toThrow(
      "Each image must have a valid url",
    );
  });

  it("rejects a stock that is negative or not an integer", () => {
    const negative = {
      ...validPayload(),
      variants: [
        {
          attributes: [{ attributeName: "Taille", value: "M" }],
          stockByStore: { "store-1": -1 },
        },
      ],
    };
    const fractional = {
      ...validPayload(),
      variants: [
        {
          attributes: [{ attributeName: "Taille", value: "M" }],
          stockByStore: { "store-1": 1.5 },
        },
      ],
    };

    expect(() => validator.parse(negative)).toThrow(ValidationError);
    expect(() => validator.parse(fractional)).toThrow(ValidationError);
  });

  it("rejects a payload without variant", () => {
    expect(() => validator.parse({ ...validPayload(), variants: [] })).toThrow(
      "At least one variant is required",
    );
  });

  it("reports every problem at once", () => {
    try {
      validator.parse({});
      throw new Error("The validator should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect((error as ValidationError).message).toContain("Name is required");
      expect((error as ValidationError).message).toContain(
        "Category is required",
      );
    }
  });
});
