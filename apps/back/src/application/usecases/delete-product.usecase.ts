import {
  ConflictError,
  NotFoundError,
} from "../../domain/errors/http-errors.js";
import type { IProductRepository } from "../../domain/interfaces/product-repository.interface.js";

export class DeleteProductUseCase {
  private readonly productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(idOrSlug: string): Promise<void> {
    const product = await this.productRepository.findById(idOrSlug);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    if (await this.productRepository.hasBeenOrdered(product.id)) {
      throw new ConflictError(
        "This product has already been ordered and cannot be deleted. Archive it instead.",
      );
    }

    await this.productRepository.delete(product.id);
  }
}
