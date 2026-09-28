import type { ProductStatus } from "../../domain/entities/product.entity.js";
import { ChangeProductStatusUseCase } from "./change-product-status.usecase.js";

export class ArchiveProductUseCase extends ChangeProductStatusUseCase {
  protected get targetStatus(): ProductStatus {
    return "ARCHIVED";
  }
}
