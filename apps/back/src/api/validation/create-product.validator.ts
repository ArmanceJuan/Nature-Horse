import type {
  CreateProductInput,
  CreateProductVariantInput,
} from "../../domain/entities/create-product-input.entity.js";
import { Validator } from "./validator.js";

const MAX_IMAGES = 10;
const MAX_VARIANTS = 100;
const MAX_ATTRIBUTES = 5;
const MAX_STOCK = 100000;

export class CreateProductValidator extends Validator<CreateProductInput> {
  protected build(
    body: Record<string, unknown>,
    errors: string[],
  ): CreateProductInput {
    return {
      name: this.text(body, "name", "Name is required", errors, 150),
      description: this.text(
        body,
        "description",
        "Description is required",
        errors,
        5000,
      ),
      price: this.price(
        body,
        "price",
        "Price must be a positive number",
        errors,
      ),
      collection: this.text(
        body,
        "collection",
        "Collection is required",
        errors,
        50,
      ),
      discipline: this.text(
        body,
        "discipline",
        "Discipline is required",
        errors,
        50,
      ),
      categoryId: this.text(
        body,
        "categoryId",
        "Category is required",
        errors,
        100,
      ),
      specs: this.textList(
        body,
        "specs",
        "Specs must be an array of strings",
        errors,
        30,
        200,
      ),
      shippingInfo: this.text(
        body,
        "shippingInfo",
        "Shipping info is required",
        errors,
        500,
      ),
      isNew: this.flag(body, "isNew", "isNew must be a boolean", errors),
      isPopular: this.flag(
        body,
        "isPopular",
        "isPopular must be a boolean",
        errors,
      ),
      images: this.images(body.images, errors),
      variants: this.variants(body.variants, errors),
    };
  }

  private images(
    value: unknown,
    errors: string[],
  ): { url: string; altText?: string }[] {
    if (!Array.isArray(value) || value.length === 0) {
      errors.push("At least one image is required");
      return [];
    }

    if (value.length > MAX_IMAGES) {
      errors.push(`At most ${MAX_IMAGES} images are allowed`);
      return [];
    }

    const images: { url: string; altText?: string }[] = [];
    let hasInvalidImage = false;

    for (const entry of value) {
      if (!this.isRecord(entry)) {
        hasInvalidImage = true;
        continue;
      }

      const url = entry.url;
      const altText = entry.altText;

      if (!this.isText(url, 500) || !/^https?:\/\//i.test(url.trim())) {
        hasInvalidImage = true;
        continue;
      }

      if (altText !== undefined && !this.isText(altText, 200)) {
        hasInvalidImage = true;
        continue;
      }

      images.push(
        altText === undefined
          ? { url: url.trim() }
          : { url: url.trim(), altText: altText.trim() },
      );
    }

    if (hasInvalidImage) {
      errors.push("Each image must have a valid url");
    }

    return images;
  }

  private variants(
    value: unknown,
    errors: string[],
  ): CreateProductVariantInput[] {
    if (!Array.isArray(value) || value.length === 0) {
      errors.push("At least one variant is required");
      return [];
    }

    if (value.length > MAX_VARIANTS) {
      errors.push(`At most ${MAX_VARIANTS} variants are allowed`);
      return [];
    }

    const variants: CreateProductVariantInput[] = [];
    let hasInvalidVariant = false;

    for (const entry of value) {
      const variant = this.parseVariant(entry);

      if (variant === null) {
        hasInvalidVariant = true;
      } else {
        variants.push(variant);
      }
    }

    if (hasInvalidVariant) {
      errors.push(
        `Each variant must have attributes and a stockByStore object of integers between 0 and ${MAX_STOCK}`,
      );
    }

    return variants;
  }

  private parseVariant(entry: unknown): CreateProductVariantInput | null {
    if (!this.isRecord(entry)) {
      return null;
    }

    const attributes = entry.attributes;
    const stockByStore = entry.stockByStore;

    if (
      !Array.isArray(attributes) ||
      attributes.length === 0 ||
      attributes.length > MAX_ATTRIBUTES
    ) {
      return null;
    }

    if (!this.isRecord(stockByStore)) {
      return null;
    }

    const parsedAttributes: { attributeName: string; value: string }[] = [];

    for (const attribute of attributes) {
      if (!this.isRecord(attribute)) {
        return null;
      }

      const attributeName = attribute.attributeName;
      const attributeValue = attribute.value;

      if (!this.isText(attributeName, 50) || !this.isText(attributeValue, 50)) {
        return null;
      }

      parsedAttributes.push({
        attributeName: attributeName.trim(),
        value: attributeValue.trim(),
      });
    }

    const parsedStock: Record<string, number> = {};

    for (const [storeId, quantity] of Object.entries(stockByStore)) {
      if (
        typeof quantity !== "number" ||
        !Number.isInteger(quantity) ||
        quantity < 0 ||
        quantity > MAX_STOCK
      ) {
        return null;
      }

      parsedStock[storeId] = quantity;
    }

    return { attributes: parsedAttributes, stockByStore: parsedStock };
  }
}
