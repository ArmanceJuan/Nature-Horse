import { prisma } from "../../config/prisma.js";
import { IProductRepository } from "../../domain/interfaces/product-repository.interface.js";
import {
  Product,
  ProductVariant,
  ProductStatus,
} from "../../domain/entities/product.entity.js";
import { ProductFilters } from "../../domain/entities/product-filters.entity.js";
import { CreateProductInput } from "../../domain/entities/create-product-input.entity.js";
import { UpdateProductInput } from "../../domain/entities/update-product-input.entity.js";
import { AppError } from "../../api/middlewares/error-handler.middleware.js";
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

type PrismaProductWithRelations = Awaited<ReturnType<typeof mapQuery>>;

const mapQuery = () => prisma.product.findFirst({ include: PRODUCT_INCLUDE });

const toDomainProduct = (
  raw: NonNullable<PrismaProductWithRelations>,
): Product => {
  const variants: ProductVariant[] = raw.variants.map((v) => ({
    id: v.id,
    attributeValues: v.attributeValues.map((av) => ({
      attributeName: av.attributeValue.attribute.name,
      value: av.attributeValue.value,
    })),
    stockByStore: Object.fromEntries(
      v.stocks.map((s) => [s.storeId, s.quantity]),
    ),
  }));

  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    description: raw.description,
    price: raw.price,
    collection: raw.collection,
    discipline: raw.discipline,
    category: raw.category
      ? {
          id: raw.category.id,
          slug: raw.category.slug,
          name: raw.category.name,
        }
      : null,
    status: raw.status as ProductStatus,
    specs: raw.specs as string[],
    shippingInfo: raw.shippingInfo,
    isNew: raw.isNew,
    isPopular: raw.isPopular,
    images: raw.images.map((img) => ({
      id: img.id,
      url: img.url,
      altText: img.altText,
      position: img.position,
    })),
    variants,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
};

const getTotalStock = (product: Product): number =>
  product.variants.reduce(
    (sum, variant) =>
      sum + Object.values(variant.stockByStore).reduce((s, qty) => s + qty, 0),
    0,
  );

const getOrCreateAttributeValueId = async (
  attributeName: string,
  value: string,
): Promise<string> => {
  const attribute = await prisma.attribute.upsert({
    where: { name: attributeName },
    update: {},
    create: { name: attributeName },
  });

  const attributeValue = await prisma.attributeValue.upsert({
    where: { attributeId_value: { attributeId: attribute.id, value } },
    update: {},
    create: { attributeId: attribute.id, value },
  });

  return attributeValue.id;
};

const generateUniqueSlug = async (name: string): Promise<string> => {
  const base = slugify(name);
  let candidate = base;
  let suffix = 2;

  while (
    await prisma.product.findUnique({
      where: { slug: candidate },
      select: { id: true },
    })
  ) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
};

export const productPrismaRepository: IProductRepository = {
  findAll: async (filters: ProductFilters) => {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit =
      filters.limit && filters.limit > 0 && filters.limit <= 100
        ? filters.limit
        : 20;

    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        collection: filters.collection || undefined,
        discipline: filters.discipline || undefined,
        category: filters.categorySlug
          ? { slug: filters.categorySlug }
          : undefined,
        isNew: filters.isNew ? true : undefined,
        name: filters.search ? { contains: filters.search } : undefined,
        price: {
          gte: filters.minPrice ?? undefined,
          lte: filters.maxPrice ?? undefined,
        },
      },
      include: PRODUCT_INCLUDE,
      orderBy: { createdAt: "desc" },
    });

    let result = products
      .map(toDomainProduct)
      .filter((p) => getTotalStock(p) > 0);

    if (filters.sizes && filters.sizes.length > 0) {
      result = result.filter((p) =>
        p.variants.some((v) =>
          v.attributeValues.some(
            (av) =>
              av.attributeName === "Taille" &&
              filters.sizes!.includes(av.value),
          ),
        ),
      );
    }

    const start = (page - 1) * limit;
    return result.slice(start, start + limit);
  },

  findById: async (idOrSlug: string) => {
    const product = await prisma.product.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      include: PRODUCT_INCLUDE,
    });

    return product ? toDomainProduct(product) : null;
  },

  findByVariantId: async (variantId: string) => {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: { include: PRODUCT_INCLUDE } },
    });

    if (!variant) return null;

    return toDomainProduct(variant.product);
  },

  create: async (data: CreateProductInput) => {
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
        select: { id: true },
      });

      if (!category) {
        throw new AppError("Category not found", 400);
      }
    }

    const slug = await generateUniqueSlug(data.name);

    const product = await prisma.product.create({
      data: {
        slug,
        name: data.name,
        description: data.description,
        price: data.price,
        collection: data.collection,
        discipline: data.discipline,
        categoryId: data.categoryId ?? null,
        specs: data.specs,
        shippingInfo: data.shippingInfo,
        isNew: data.isNew,
        isPopular: data.isPopular,
        images: {
          create: data.images.map((img, index) => ({
            url: img.url,
            altText: img.altText ?? data.name,
            position: index,
          })),
        },
      },
    });

    for (const variant of data.variants) {
      const attributeValueIds = await Promise.all(
        variant.attributes.map((attr) =>
          getOrCreateAttributeValueId(attr.attributeName, attr.value),
        ),
      );

      const createdVariant = await prisma.productVariant.create({
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
        ([, qty]) => qty > 0,
      );
      if (stockEntries.length > 0) {
        await prisma.stock.createMany({
          data: stockEntries.map(([storeId, quantity]) => ({
            productVariantId: createdVariant.id,
            storeId,
            quantity,
          })),
        });
      }
    }

    const fullProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: PRODUCT_INCLUDE,
    });

    return toDomainProduct(fullProduct!);
  },

  update: async (id: string, data: UpdateProductInput) => {
    await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        collection: data.collection,
        discipline: data.discipline,
        specs: data.specs,
        shippingInfo: data.shippingInfo,
        isNew: data.isNew,
        isPopular: data.isPopular,
      },
    });

    const updated = await prisma.product.findUnique({
      where: { id },
      include: PRODUCT_INCLUDE,
    });

    return toDomainProduct(updated!);
  },

  delete: async (id: string) => {
    await prisma.product.delete({ where: { id } });
  },

  updateStatus: async (id: string, status: ProductStatus) => {
    const updated = await prisma.product.update({
      where: { id },
      data: { status },
      include: PRODUCT_INCLUDE,
    });

    return toDomainProduct(updated);
  },

  adjustStock: async (variantId: string, storeId: string, quantity: number) => {
    await prisma.stock.upsert({
      where: {
        productVariantId_storeId: { productVariantId: variantId, storeId },
      },
      update: { quantity },
      create: { productVariantId: variantId, storeId, quantity },
    });

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: { include: PRODUCT_INCLUDE } },
    });

    return toDomainProduct(variant!.product);
  },
};
