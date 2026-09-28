import type {
  Product,
  ProductStatus,
} from "../../domain/entities/product.entity.js";
import { NotFoundError } from "../../domain/errors/http-errors.js";
import type { IProductRepository } from "../../domain/interfaces/product-repository.interface.js";

export abstract class ChangeProductStatusUseCase {
  private readonly productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  protected abstract get targetStatus(): ProductStatus;

  async execute(idOrSlug: string): Promise<Product> {
    const product = await this.productRepository.findById(idOrSlug);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    if (product.status === this.targetStatus) {
      return product;
    }

    return this.productRepository.updateStatus(product.id, this.targetStatus);
  }
}
