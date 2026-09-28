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
import type { DatabaseClient } from "../database/database-client.js";
import { slugify } from "../utils/slugify.util.js";

const PRODUCT_INCLUDE = {
  category: true,
  images: { orderBy: { position: "asc" as const } },
  variants: {
    include: {
      attributeValues: {
        include: { attributeValue: { include: { attribute: true } } },
      },
      stocks: true,
    },
  },
};

const findFirstWithRelations = (database: DatabaseClient) =>
  database.product.findFirst({ include: PRODUCT_INCLUDE });

type ProductRow = NonNullable<
  Awaited<ReturnType<typeof findFirstWithRelations>>
>;

export class ProductPrismaRepository implements IProductRepository {
  private readonly database: DatabaseClient;

  constructor(database: DatabaseClient) {
    this.database = database;
  }

  async findAll(criteria: ProductCriteria): Promise<Product[]> {
    const rows = await this.database.product.findMany({
      where: {
        status: criteria.status,
        collection: criteria.collection || undefined,
        discipline: criteria.discipline || undefined,
        category: criteria.categorySlug
          ? { slug: criteria.categorySlug }
          : undefined,
        isNew: criteria.isNew ? true : undefined,
        name: criteria.search ? { contains: criteria.search } : undefined,
        price: {
          gte: criteria.minPrice ?? undefined,
          lte: criteria.maxPrice ?? undefined,
        },
      },
      include: PRODUCT_INCLUDE,
      orderBy: { createdAt: "desc" },
    });

    return rows.map((row) => this.toDomain(row));
  }

  async findById(idOrSlug: string): Promise<Product | null> {
    const row = await this.database.product.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      include: PRODUCT_INCLUDE,
    });

    return row ? this.toDomain(row) : null;
  }

  async findByVariantId(variantId: string): Promise<Product | null> {
    const variant = await this.database.productVariant.findUnique({
      where: { id: variantId },
      include: { product: { include: PRODUCT_INCLUDE } },
    });

    return variant ? this.toDomain(variant.product) : null;
  }

  async create(data: CreateProductInput): Promise<Product> {
    const productId = await this.database.$transaction(
      async (tx) => {
        const base = slugify(data.name);
        let slug = base;
        let suffix = 2;

        while (
          await tx.product.findUnique({ where: { slug }, select: { id: true } })
        ) {
          slug = `${base}-${suffix}`;
          suffix += 1;
        }

        const product = await tx.product.create({
          data: {
            slug,
            name: data.name,
            description: data.description,
            price: data.price,
            collection: data.collection,
            discipline: data.discipline,
            categoryId: data.categoryId,
            specs: data.specs,
            shippingInfo: data.shippingInfo,
            isNew: data.isNew,
            isPopular: data.isPopular,
            images: {
              create: data.images.map((image, position) => ({
                url: image.url,
                altText: image.altText ?? data.name,
                position,
              })),
            },
          },
        });

        for (const variant of data.variants) {
          const attributeValueIds: string[] = [];

          for (const attribute of variant.attributes) {
            const savedAttribute = await tx.attribute.upsert({
              where: { name: attribute.attributeName },
              update: {},
              create: { name: attribute.attributeName },
            });

            const savedValue = await tx.attributeValue.upsert({
              where: {
                attributeId_value: {
                  attributeId: savedAttribute.id,
                  value: attribute.value,
                },
              },
              update: {},
              create: {
                attributeId: savedAttribute.id,
                value: attribute.value,
              },
            });

            attributeValueIds.push(savedValue.id);
          }

          const createdVariant = await tx.productVariant.create({
            data: {
              productId: product.id,
              attributeValues: {
                create: attributeValueIds.map((attributeValueId) => ({
                  attributeValueId,
                })),
              },
            },
          });

          const stockEntries = Object.entries(variant.stockByStore).filter(
            ([, quantity]) => quantity > 0,
          );

          if (stockEntries.length > 0) {
            await tx.stock.createMany({
              data: stockEntries.map(([storeId, quantity]) => ({
                productVariantId: createdVariant.id,
                storeId,
                quantity,
              })),
            });
          }
        }

        return product.id;
      },
      { timeout: 15000 },
    );

    const created = await this.findById(productId);

    if (!created) {
      throw new Error("The product was created but could not be read back");
    }

    return created;
  }

  async update(id: string, changes: UpdateProductInput): Promise<Product> {
    const row = await this.database.product.update({
      where: { id },
      data: {
        name: changes.name,
        description: changes.description,
        price: changes.price,
        collection: changes.collection,
        discipline: changes.discipline,
        categoryId: changes.categoryId,
        specs: changes.specs,
        shippingInfo: changes.shippingInfo,
        isNew: changes.isNew,
        isPopular: changes.isPopular,
      },
      include: PRODUCT_INCLUDE,
    });

    return this.toDomain(row);
  }

  async delete(id: string): Promise<void> {
    await this.database.product.delete({ where: { id } });
  }

  async hasBeenOrdered(id: string): Promise<boolean> {
    const count = await this.database.orderItem.count({
      where: { productVariant: { productId: id } },
    });

    return count > 0;
  }

  async updateStatus(id: string, status: ProductStatus): Promise<Product> {
    const row = await this.database.product.update({
      where: { id },
      data: { status },
      include: PRODUCT_INCLUDE,
    });

    return this.toDomain(row);
  }

  async adjustStock(
    variantId: string,
    storeId: string,
    quantity: number,
  ): Promise<Product> {
    await this.database.stock.upsert({
      where: {
        productVariantId_storeId: { productVariantId: variantId, storeId },
      },
      update: { quantity },
      create: { productVariantId: variantId, storeId, quantity },
    });

    const variant = await this.database.productVariant.findUniqueOrThrow({
      where: { id: variantId },
      include: { product: { include: PRODUCT_INCLUDE } },
    });

    return this.toDomain(variant.product);
  }

  private toDomain(row: ProductRow): Product {
    return new Product({
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description,
      price: row.price,
      collection: row.collection,
      discipline: row.discipline,
      category: row.category
        ? new ProductCategory({
            id: row.category.id,
            slug: row.category.slug,
            name: row.category.name,
          })
        : null,
      status: row.status as ProductStatus,
      specs: row.specs as string[],
      shippingInfo: row.shippingInfo,
      isNew: row.isNew,
      isPopular: row.isPopular,
      images: row.images.map(
        (image) =>
          new ProductImage({
            id: image.id,
            url: image.url,
            altText: image.altText,
            position: image.position,
          }),
      ),
      variants: row.variants.map(
        (variant) =>
          new ProductVariant({
            id: variant.id,
            attributeValues: variant.attributeValues.map(
              (link) =>
                new AttributeValue({
                  attributeName: link.attributeValue.attribute.name,
                  value: link.attributeValue.value,
                }),
            ),
            stockByStore: Object.fromEntries(
              variant.stocks.map((stock) => [stock.storeId, stock.quantity]),
            ),
          }),
      ),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
