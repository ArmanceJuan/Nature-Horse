import type { Product } from "../../domain/entities/product.entity.js";
import { NotFoundError } from "../../domain/errors/http-errors.js";
import type { IProductRepository } from "../../domain/interfaces/product-repository.interface.js";

export class GetProductByIdUseCase {
  private readonly productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(idOrSlug: string): Promise<Product> {
    const product = await this.productRepository.findById(idOrSlug);

    if (!product || !product.isActive()) {
      throw new NotFoundError("Product not found");
    }

    return product;
  }
}
