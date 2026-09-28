import type { Product } from "../../domain/entities/product.entity.js";
import {
  NotFoundError,
  ValidationError,
} from "../../domain/errors/http-errors.js";
import type { IProductRepository } from "../../domain/interfaces/product-repository.interface.js";
import type { IStoreRepository } from "../../domain/interfaces/store-repository.interface.js";

export interface AdjustStockInput {
  storeId: string;
  quantity: number;
}

export class AdjustStockUseCase {
  private readonly productRepository: IProductRepository;
  private readonly storeRepository: IStoreRepository;

  constructor(
    productRepository: IProductRepository,
    storeRepository: IStoreRepository,
  ) {
    this.productRepository = productRepository;
    this.storeRepository = storeRepository;
  }

  async execute(variantId: string, input: AdjustStockInput): Promise<Product> {
    if (!Number.isInteger(input.quantity) || input.quantity < 0) {
      throw new ValidationError("Quantity must be a positive integer or zero");
    }

    const product = await this.productRepository.findByVariantId(variantId);

    if (!product) {
      throw new NotFoundError("Product variant not found");
    }

    const store = await this.storeRepository.findById(input.storeId);

    if (!store) {
      throw new NotFoundError("Store not found");
    }

    return this.productRepository.adjustStock(
      variantId,
      input.storeId,
      input.quantity,
    );
  }
}
