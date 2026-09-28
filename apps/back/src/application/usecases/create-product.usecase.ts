import type { CreateProductInput } from "../../domain/entities/create-product-input.entity.js";
import type { Product } from "../../domain/entities/product.entity.js";
import { ValidationError } from "../../domain/errors/http-errors.js";
import type { ICategoryRepository } from "../../domain/interfaces/category-repository.interface.js";
import type { IProductRepository } from "../../domain/interfaces/product-repository.interface.js";
import type { IStoreRepository } from "../../domain/interfaces/store-repository.interface.js";

export class CreateProductUseCase {
  private readonly productRepository: IProductRepository;
  private readonly categoryRepository: ICategoryRepository;
  private readonly storeRepository: IStoreRepository;

  constructor(
    productRepository: IProductRepository,
    categoryRepository: ICategoryRepository,
    storeRepository: IStoreRepository,
  ) {
    this.productRepository = productRepository;
    this.categoryRepository = categoryRepository;
    this.storeRepository = storeRepository;
  }

  async execute(input: CreateProductInput): Promise<Product> {
    await this.ensureCategoryExists(input.categoryId);
    await this.ensureStoresExist(input);
    this.ensureVariantsAreDistinct(input);
    this.ensureSomeStockExists(input);

    return this.productRepository.create(input);
  }

  private async ensureCategoryExists(categoryId: string): Promise<void> {
    const category = await this.categoryRepository.findById(categoryId);

    if (!category) {
      throw new ValidationError("Category not found");
    }
  }

  private async ensureStoresExist(input: CreateProductInput): Promise<void> {
    const knownStoreIds = new Set(
      (await this.storeRepository.findAll()).map((store) => store.id),
    );

    for (const variant of input.variants) {
      for (const storeId of Object.keys(variant.stockByStore)) {
        if (!knownStoreIds.has(storeId)) {
          throw new ValidationError(`Unknown store: ${storeId}`);
        }
      }
    }
  }

  private ensureVariantsAreDistinct(input: CreateProductInput): void {
    const seen = new Set<string>();

    for (const variant of input.variants) {
      const key = variant.attributes
        .map((attribute) =>
          `${attribute.attributeName}:${attribute.value}`.toLowerCase(),
        )
        .sort()
        .join("|");

      if (seen.has(key)) {
        throw new ValidationError("Two variants have the same attributes");
      }

      seen.add(key);
    }
  }

  private ensureSomeStockExists(input: CreateProductInput): void {
    const hasAnyStock = input.variants.some((variant) =>
      Object.values(variant.stockByStore).some((quantity) => quantity > 0),
    );

    if (!hasAnyStock) {
      throw new ValidationError(
        "At least one variant must have stock in at least one store",
      );
    }
  }
}
