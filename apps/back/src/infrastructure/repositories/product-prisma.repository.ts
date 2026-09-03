import { prisma } from "../../config/prisma.js";
import { IProductRepository } from "../../domain/interfaces/product-repository.interface.js";
import {
  Product,
  ProductVariant,
} from "../../domain/entities/product.entity.js";
import { ProductFilters } from "../../domain/entities/product-filters.entity.js";
import { CreateProductInput } from "../../domain/entities/create-product-input.entity.js";
import { UpdateProductInput } from "../../domain/entities/update-product-input.entity.js";

const PRODUCT_INCLUDE = {
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
    name: raw.name,
    description: raw.description,
    price: raw.price,
    collection: raw.collection,
    discipline: raw.discipline,
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

export const productPrismaRepository: IProductRepository = {
  findAll: async (filters: ProductFilters) => {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit =
      filters.limit && filters.limit > 0 && filters.limit <= 100
        ? filters.limit
        : 20;

    const products = await prisma.product.findMany({
      where: {
        collection: filters.collection || undefined,
        discipline: filters.discipline || undefined,
        name: filters.search ? { contains: filters.search } : undefined,
        price: {
          gte: filters.minPrice ?? undefined,
          lte: filters.maxPrice ?? undefined,
        },
      },
      include: PRODUCT_INCLUDE,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    let result = products.map(toDomainProduct);

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

    return result;
  },

  findById: async (id: string) => {
    const product = await prisma.product.findUnique({
      where: { id },
      include: PRODUCT_INCLUDE,
    });

    return product ? toDomainProduct(product) : null;
  },

  create: async (data: CreateProductInput) => {
    const product = await prisma.product.create({
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
};
