import type { CreateProductInput } from "../../domain/entities/create-product-input.entity.js";
import {
  AttributeValue,
  Product,
  ProductVariant,
} from "../../domain/entities/product.entity.js";
import type {
  ProductProps,
  ProductVariantProps,
} from "../../domain/entities/product.entity.js";

export const buildVariant = (
  overrides: Partial<ProductVariantProps> = {},
): ProductVariant =>
  new ProductVariant({
    id: "variant-1",
    attributeValues: [
      new AttributeValue({ attributeName: "Taille", value: "M" }),
      new AttributeValue({ attributeName: "Couleur", value: "Noir" }),
    ],
    stockByStore: { "store-1": 5 },
    ...overrides,
  });

export const buildProduct = (overrides: Partial<ProductProps> = {}): Product =>
  new Product({
    id: "product-1",
    slug: "test-product",
    name: "Test Product",
    description: "desc",
    price: 100,
    collection: "haute-sellerie",
    discipline: "dressage",
    category: null,
    status: "ACTIVE",
    specs: [],
    shippingInfo: "info",
    isNew: false,
    isPopular: false,
    images: [],
    variants: [buildVariant()],
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    ...overrides,
  });

export const buildCreateProductInput = (
  overrides: Partial<CreateProductInput> = {},
): CreateProductInput => ({
  name: "Selle Monolith",
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
      attributes: [
        { attributeName: "Taille", value: "M" },
        { attributeName: "Couleur", value: "Noir" },
      ],
      stockByStore: { "store-1": 2 },
    },
  ],
  ...overrides,
});
