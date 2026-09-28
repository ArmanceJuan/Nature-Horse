import type { AdjustStockInput } from "../../application/usecases/adjust-stock.usecase.js";
import { Validator } from "./validator.js";

const MAX_STOCK = 100000;

export class AdjustStockValidator extends Validator<AdjustStockInput> {
  protected build(
    body: Record<string, unknown>,
    errors: string[],
  ): AdjustStockInput {
    const quantity = body.quantity;
    let validQuantity = 0;

    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < 0 ||
      quantity > MAX_STOCK
    ) {
      errors.push(`quantity must be an integer between 0 and ${MAX_STOCK}`);
    } else {
      validQuantity = quantity;
    }

    return {
      storeId: this.text(body, "storeId", "storeId is required", errors, 100),
      quantity: validQuantity,
    };
  }
}
