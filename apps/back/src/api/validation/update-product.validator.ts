import type { UpdateProductInput } from "../../domain/entities/update-product-input.entity.js";
import { Validator } from "./validator.js";

export class UpdateProductValidator extends Validator<UpdateProductInput> {
  protected build(
    body: Record<string, unknown>,
    errors: string[],
  ): UpdateProductInput {
    const changes: UpdateProductInput = {};

    if (this.has(body, "name")) {
      changes.name = this.text(
        body,
        "name",
        "Name must be a non-empty string",
        errors,
        150,
      );
    }

    if (this.has(body, "description")) {
      changes.description = this.text(
        body,
        "description",
        "Description must be a non-empty string",
        errors,
        5000,
      );
    }

    if (this.has(body, "price")) {
      changes.price = this.price(
        body,
        "price",
        "Price must be a positive number",
        errors,
      );
    }

    if (this.has(body, "collection")) {
      changes.collection = this.text(
        body,
        "collection",
        "Collection must be a non-empty string",
        errors,
        50,
      );
    }

    if (this.has(body, "discipline")) {
      changes.discipline = this.text(
        body,
        "discipline",
        "Discipline must be a non-empty string",
        errors,
        50,
      );
    }

    if (this.has(body, "categoryId")) {
      changes.categoryId = this.text(
        body,
        "categoryId",
        "Category must be a non-empty string",
        errors,
        100,
      );
    }

    if (this.has(body, "specs")) {
      changes.specs = this.textList(
        body,
        "specs",
        "Specs must be an array of strings",
        errors,
        30,
        200,
      );
    }

    if (this.has(body, "shippingInfo")) {
      changes.shippingInfo = this.text(
        body,
        "shippingInfo",
        "Shipping info must be a non-empty string",
        errors,
        500,
      );
    }

    if (this.has(body, "isNew")) {
      changes.isNew = this.flag(
        body,
        "isNew",
        "isNew must be a boolean",
        errors,
      );
    }

    if (this.has(body, "isPopular")) {
      changes.isPopular = this.flag(
        body,
        "isPopular",
        "isPopular must be a boolean",
        errors,
      );
    }

    if (Object.keys(changes).length === 0 && errors.length === 0) {
      errors.push("At least one field to update is required");
    }

    return changes;
  }
}
