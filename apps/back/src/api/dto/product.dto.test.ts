import { validateCreateProductDTO } from "./product.dto.js";

const buildValidPayload = () => ({
  name: "Selle",
  description: "Une selle",
  price: 100,
  collection: "haute-sellerie",
  discipline: "dressage",
  categoryId: "category-1",
  specs: ["Cuir"],
  shippingInfo: "Click & collect",
  isNew: false,
  isPopular: false,
  images: [{ url: "https://example.com/selle.jpg" }],
  variants: [
    {
      attributes: [{ attributeName: "Taille", value: "M" }],
      stockByStore: { "store-1": 2 },
    },
  ],
});

describe("validateCreateProductDTO", () => {
  it("accepts a complete payload", () => {
    expect(validateCreateProductDTO(buildValidPayload()).isValid).toBe(true);
  });

  it("rejects a payload without category", () => {
    const { categoryId, ...withoutCategory } = buildValidPayload();

    const result = validateCreateProductDTO(withoutCategory);

    expect(categoryId).toBeDefined();
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Category is required");
  });

  it("rejects an empty category", () => {
    const result = validateCreateProductDTO({
      ...buildValidPayload(),
      categoryId: "  ",
    });

    expect(result.errors).toContain("Category is required");
  });
});
