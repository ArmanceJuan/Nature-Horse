import { ORDER_LIMITS } from "../../domain/entities/create-order-input.entity.js";
import type {
  CreateOrderItemInput,
  GuestCustomerInput,
} from "../../domain/entities/create-order-input.entity.js";
import { Email } from "../../domain/value-objects/email.js";
import { Validator } from "./validator.js";

export interface CreateOrderBody {
  storeId: string;
  customer?: GuestCustomerInput;
  items: CreateOrderItemInput[];
}

export class CreateOrderValidator extends Validator<CreateOrderBody> {
  private static readonly PHONE_PATTERN = /^[0-9+().\-\s]{6,20}$/;

  protected build(
    body: Record<string, unknown>,
    errors: string[],
  ): CreateOrderBody {
    const result: CreateOrderBody = {
      storeId: this.text(body, "storeId", "storeId is required", errors, 100),
      items: this.items(body.items, errors),
    };

    if (body.customer !== undefined && body.customer !== null) {
      result.customer = this.customer(body.customer, errors);
    }

    return result;
  }

  private items(value: unknown, errors: string[]): CreateOrderItemInput[] {
    if (!Array.isArray(value) || value.length === 0) {
      errors.push("At least one item is required");
      return [];
    }

    if (value.length > ORDER_LIMITS.MAX_LINES) {
      errors.push(
        `An order cannot contain more than ${ORDER_LIMITS.MAX_LINES} lines`,
      );
      return [];
    }

    const items: CreateOrderItemInput[] = [];
    let hasInvalidItem = false;

    for (const entry of value) {
      if (!this.isRecord(entry)) {
        hasInvalidItem = true;
        continue;
      }

      const variantId = entry.productVariantId;
      const quantity = entry.quantity;

      if (
        !this.isText(variantId, 100) ||
        typeof quantity !== "number" ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > ORDER_LIMITS.MAX_UNITS_PER_LINE
      ) {
        hasInvalidItem = true;
        continue;
      }

      items.push({ productVariantId: variantId.trim(), quantity });
    }

    if (hasInvalidItem) {
      errors.push(
        `Each item needs a productVariantId and an integer quantity between 1 and ${ORDER_LIMITS.MAX_UNITS_PER_LINE}`,
      );
    }

    return items;
  }

  private customer(value: unknown, errors: string[]): GuestCustomerInput {
    if (!this.isRecord(value)) {
      errors.push("Customer details are invalid");
      return { email: "", firstName: "", lastName: "" };
    }

    const rawEmail = value.email;
    const email =
      typeof rawEmail === "string" && Email.isValid(rawEmail)
        ? rawEmail.trim()
        : "";

    if (email === "") {
      errors.push("A valid email is required");
    }

    const customer: GuestCustomerInput = {
      email,
      firstName: this.text(
        value,
        "firstName",
        "First name is required",
        errors,
        50,
      ),
      lastName: this.text(
        value,
        "lastName",
        "Last name is required",
        errors,
        50,
      ),
    };

    const phone = value.phone;

    if (phone !== undefined && phone !== null && phone !== "") {
      if (
        typeof phone === "string" &&
        CreateOrderValidator.PHONE_PATTERN.test(phone.trim())
      ) {
        customer.phone = phone.trim();
      } else {
        errors.push("Phone number is invalid");
      }
    }

    return customer;
  }
}
