import type { Product } from "../../domain/entities/product.entity.js";
import type { UpdateProductInput } from "../../domain/entities/update-product-input.entity.js";
import {
  NotFoundError,
  ValidationError,
} from "../../domain/errors/http-errors.js";
import type { ICategoryRepository } from "../../domain/interfaces/category-repository.interface.js";
import type { IProductRepository } from "../../domain/interfaces/product-repository.interface.js";

export class UpdateProductUseCase {
  private readonly productRepository: IProductRepository;
  private readonly categoryRepository: ICategoryRepository;

  constructor(
    productRepository: IProductRepository,
    categoryRepository: ICategoryRepository,
  ) {
    this.productRepository = productRepository;
    this.categoryRepository = categoryRepository;
  }

  async execute(
    idOrSlug: string,
    changes: UpdateProductInput,
  ): Promise<Product> {
    const product = await this.productRepository.findById(idOrSlug);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    if (changes.categoryId !== undefined) {
      const category = await this.categoryRepository.findById(
        changes.categoryId,
      );

      if (!category) {
        throw new ValidationError("Category not found");
      }
    }

    return this.productRepository.update(product.id, changes);
  }
}
