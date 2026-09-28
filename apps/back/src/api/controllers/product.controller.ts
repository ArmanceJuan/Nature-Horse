import type { Request, Response } from "express";
import type {
  AdjustStockInput,
  AdjustStockUseCase,
} from "../../application/usecases/adjust-stock.usecase.js";
import type { ArchiveProductUseCase } from "../../application/usecases/archive-product.usecase.js";
import type { CreateProductUseCase } from "../../application/usecases/create-product.usecase.js";
import type { DeleteProductUseCase } from "../../application/usecases/delete-product.usecase.js";
import type { GetAllProductsUseCase } from "../../application/usecases/get-all-products.usecase.js";
import type { GetProductByIdUseCase } from "../../application/usecases/get-product-by-id.usecase.js";
import type { ReactivateProductUseCase } from "../../application/usecases/reactivate-product.usecase.js";
import type { UpdateProductUseCase } from "../../application/usecases/update-product.usecase.js";
import type { CreateProductInput } from "../../domain/entities/create-product-input.entity.js";
import type { ProductFilters } from "../../domain/entities/product-filters.entity.js";
import type { UpdateProductInput } from "../../domain/entities/update-product-input.entity.js";
import { asyncHandler } from "../middlewares/async-handler.middleware.js";
import type { IValidator } from "../validation/validator.js";

export interface ProductControllerDependencies {
  getAllProducts: GetAllProductsUseCase;
  getProductById: GetProductByIdUseCase;
  createProduct: CreateProductUseCase;
  updateProduct: UpdateProductUseCase;
  deleteProduct: DeleteProductUseCase;
  archiveProduct: ArchiveProductUseCase;
  reactivateProduct: ReactivateProductUseCase;
  adjustStock: AdjustStockUseCase;
  catalogQueryParser: IValidator<ProductFilters>;
  createProductValidator: IValidator<CreateProductInput>;
  updateProductValidator: IValidator<UpdateProductInput>;
  adjustStockValidator: IValidator<AdjustStockInput>;
}

export class ProductController {
  private readonly dependencies: ProductControllerDependencies;

  constructor(dependencies: ProductControllerDependencies) {
    this.dependencies = dependencies;
  }

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const filters = this.dependencies.catalogQueryParser.parse(req.query);
    const products = await this.dependencies.getAllProducts.execute(filters);

    res.status(200).json(products);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const product = await this.dependencies.getProductById.execute(
      req.params.id as string,
    );

    res.status(200).json(product);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const input = this.dependencies.createProductValidator.parse(req.body);
    const product = await this.dependencies.createProduct.execute(input);

    res.status(201).json(product);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const changes = this.dependencies.updateProductValidator.parse(req.body);
    const product = await this.dependencies.updateProduct.execute(
      req.params.id as string,
      changes,
    );

    res.status(200).json(product);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.dependencies.deleteProduct.execute(req.params.id as string);

    res.status(204).send();
  });

  archive = asyncHandler(async (req: Request, res: Response) => {
    const product = await this.dependencies.archiveProduct.execute(
      req.params.id as string,
    );

    res.status(200).json(product);
  });

  reactivate = asyncHandler(async (req: Request, res: Response) => {
    const product = await this.dependencies.reactivateProduct.execute(
      req.params.id as string,
    );

    res.status(200).json(product);
  });

  adjustStock = asyncHandler(async (req: Request, res: Response) => {
    const input = this.dependencies.adjustStockValidator.parse(req.body);
    const product = await this.dependencies.adjustStock.execute(
      req.params.variantId as string,
      input,
    );

    res.status(200).json(product);
  });
}
