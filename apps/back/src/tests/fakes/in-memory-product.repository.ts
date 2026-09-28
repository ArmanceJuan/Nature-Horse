import type { CreateProductInput } from "../../domain/entities/create-product-input.entity.js";
import type { ProductCriteria } from "../../domain/entities/product-filters.entity.js";
import {
  AttributeValue,
  Product,
  ProductCategory,
  ProductImage,
  ProductVariant,
} from "../../domain/entities/product.entity.js";
import type { ProductStatus } from "../../domain/entities/product.entity.js";
import type { UpdateProductInput } from "../../domain/entities/update-product-input.entity.js";
import type { IProductRepository } from "../../domain/interfaces/product-repository.interface.js";
import { slugify } from "../../infrastructure/utils/slugify.util.js";

export class InMemoryProductRepository implements IProductRepository {
  private products: Product[];
  private readonly orderedProductIds: Set<string>;
  private sequence = 0;

  lastCriteria: ProductCriteria | null = null;
  deletedIds: string[] = [];

  constructor(products: Product[] = [], orderedProductIds: string[] = []) {
    this.products = [...products];
    this.orderedProductIds = new Set(orderedProductIds);
  }

  async findAll(criteria: ProductCriteria): Promise<Product[]> {
    this.lastCriteria = criteria;

    return this.products.filter(
      (product) =>
        (criteria.status === undefined || product.status === criteria.status) &&
        (criteria.collection === undefined ||
          product.collection === criteria.collection) &&
        (criteria.discipline === undefined ||
          product.discipline === criteria.discipline) &&
        (criteria.categorySlug === undefined ||
          product.category?.slug === criteria.categorySlug) &&
        (criteria.isNew === undefined || product.isNew === criteria.isNew) &&
        (criteria.search === undefined ||
          product.name.toLowerCase().includes(criteria.search.toLowerCase())) &&
        (criteria.minPrice === undefined ||
          product.price >= criteria.minPrice) &&
        (criteria.maxPrice === undefined || product.price <= criteria.maxPrice),
    );
  }

  async findById(idOrSlug: string): Promise<Product | null> {
    return (
      this.products.find(
        (product) => product.id === idOrSlug || product.slug === idOrSlug,
      ) ?? null
    );
  }

  async findByVariantId(variantId: string): Promise<Product | null> {
    return (
      this.products.find((product) =>
        product.variants.some((variant) => variant.id === variantId),
      ) ?? null
    );
  }

  async create(data: CreateProductInput): Promise<Product> {
    this.sequence += 1;
    const id = `product-${this.sequence}`;

    const product = new Product({
      id,
      slug: slugify(data.name),
      name: data.name,
      description: data.description,
      price: data.price,
      collection: data.collection,
      discipline: data.discipline,
      category: new ProductCategory({
        id: data.categoryId,
        slug: "category",
        name: "Category",
      }),
      status: "ACTIVE",
      specs: data.specs,
      shippingInfo: data.shippingInfo,
      isNew: data.isNew,
      isPopular: data.isPopular,
      images: data.images.map(
        (image, position) =>
          new ProductImage({
            id: `${id}-image-${position}`,
            url: image.url,
            altText: image.altText ?? data.name,
            position,
          }),
      ),
      variants: data.variants.map(
        (variant, index) =>
          new ProductVariant({
            id: `${id}-variant-${index}`,
            attributeValues: variant.attributes.map(
              (attribute) => new AttributeValue(attribute),
            ),
            stockByStore: variant.stockByStore,
          }),
      ),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.products.push(product);

    return product;
  }

  async update(id: string, changes: UpdateProductInput): Promise<Product> {
    const existing = this.requireProduct(id);

    const updated = new Product({
      ...existing,
      name: changes.name ?? existing.name,
      description: changes.description ?? existing.description,
      price: changes.price ?? existing.price,
      collection: changes.collection ?? existing.collection,
      discipline: changes.discipline ?? existing.discipline,
      specs: changes.specs ?? existing.specs,
      shippingInfo: changes.shippingInfo ?? existing.shippingInfo,
      isNew: changes.isNew ?? existing.isNew,
      isPopular: changes.isPopular ?? existing.isPopular,
    });

    this.replace(updated);

    return updated;
  }

  async delete(id: string): Promise<void> {
    this.products = this.products.filter((product) => product.id !== id);
    this.deletedIds.push(id);
  }

  async hasBeenOrdered(id: string): Promise<boolean> {
    return this.orderedProductIds.has(id);
  }

  async updateStatus(id: string, status: ProductStatus): Promise<Product> {
    const updated = this.requireProduct(id).withStatus(status);

    this.replace(updated);

    return updated;
  }

  async adjustStock(
    variantId: string,
    storeId: string,
    quantity: number,
  ): Promise<Product> {
    const product = this.products.find((candidate) =>
      candidate.variants.some((variant) => variant.id === variantId),
    );

    if (!product) {
      throw new Error(`No product owns the variant ${variantId}`);
    }

    const updated = product.withVariantStock(variantId, storeId, quantity);

    this.replace(updated);

    return updated;
  }

  private requireProduct(id: string): Product {
    const product = this.products.find((candidate) => candidate.id === id);

    if (!product) {
      throw new Error(`No product with the id ${id}`);
    }

    return product;
  }

  private replace(updated: Product): void {
    this.products = this.products.map((product) =>
      product.id === updated.id ? updated : product,
    );
  }
}
