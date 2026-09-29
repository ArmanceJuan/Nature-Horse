import { ORDER_STATUSES } from "../../domain/entities/order.entity.js";
import type { OrderStatus } from "../../domain/entities/order.entity.js";
import { Validator } from "./validator.js";

export interface UpdateOrderStatusBody {
  status: OrderStatus;
}

export class UpdateOrderStatusValidator extends Validator<UpdateOrderStatusBody> {
  protected build(
    body: Record<string, unknown>,
    errors: string[],
  ): UpdateOrderStatusBody {
    const status = body.status;

    if (
      typeof status !== "string" ||
      !ORDER_STATUSES.includes(status as OrderStatus)
    ) {
      errors.push(`status must be one of ${ORDER_STATUSES.join(", ")}`);
      return { status: "PENDING" };
    }

    return { status: status as OrderStatus };
  }
}
