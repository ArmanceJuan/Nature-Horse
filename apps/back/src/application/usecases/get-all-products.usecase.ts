import type { ProductFilters } from "../../domain/entities/product-filters.entity.js";
import type { Product } from "../../domain/entities/product.entity.js";
import type { IProductRepository } from "../../domain/interfaces/product-repository.interface.js";
import { Pagination } from "../../domain/value-objects/pagination.js";

export class GetAllProductsUseCase {
  private readonly productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(filters: ProductFilters): Promise<Product[]> {
    const { sizes, page, limit, ...criteria } = filters;

    const candidates = await this.productRepository.findAll({
      ...criteria,
      status: "ACTIVE",
    });
    const visible = candidates.filter((product) =>
      product.isVisibleInCatalog(),
    );
    const matching =
      sizes && sizes.length > 0
        ? visible.filter((product) => product.hasAnySize(sizes))
        : visible;

    return Pagination.of(page, limit).apply(matching);
  }
}
