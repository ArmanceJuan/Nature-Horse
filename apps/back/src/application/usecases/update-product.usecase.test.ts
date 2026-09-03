import { updateProductUsecase } from "./update-product.usecase.js";
import { IProductRepository } from "../../domain/interfaces/product-repository.interface.js";
import {
  Product,
  ProductStatus,
} from "../../domain/entities/product.entity.js";

describe("updateProductUsecase", () => {
  const fakeProduct: Product = {
    id: "1",
    name: "Test",
    description: "desc",
    price: 50,
    collection: "textile-performance",
    discipline: "loisir",
    specs: [],
    shippingInfo: "info",
    isNew: false,
    isPopular: false,
    images: [],
    variants: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "ACTIVE",
  };

  it("should update the product when it exists", async () => {
    const fakeRepository: IProductRepository = {
      findAll: async () => [],
      findById: async () => fakeProduct,
      create: async () => fakeProduct,
      update: async (id, data) => ({ ...fakeProduct, ...data }),
      delete: async () => {},
      findByVariantId: function (variantId: string): Promise<Product | null> {
        throw new Error("Function not implemented.");
      },
      updateStatus: function (
        id: string,
        status: ProductStatus,
      ): Promise<Product> {
        throw new Error("Function not implemented.");
      },
      adjustStock: function (
        variantId: string,
        storeId: string,
        quantity: number,
      ): Promise<Product> {
        throw new Error("Function not implemented.");
      },
    };

    const updateProduct = updateProductUsecase(fakeRepository);
    const result = await updateProduct("1", { price: 75 });

    expect(result.price).toBe(75);
  });

  it("should throw 404 when product does not exist", async () => {
    const fakeRepository: IProductRepository = {
      findAll: async () => [],
      findById: async () => null,
      create: async () => fakeProduct,
      update: async (id, data) => ({ ...fakeProduct, ...data }),
      delete: async () => {},
      findByVariantId: function (variantId: string): Promise<Product | null> {
        throw new Error("Function not implemented.");
      },
      updateStatus: function (
        id: string,
        status: ProductStatus,
      ): Promise<Product> {
        throw new Error("Function not implemented.");
      },
      adjustStock: function (
        variantId: string,
        storeId: string,
        quantity: number,
      ): Promise<Product> {
        throw new Error("Function not implemented.");
      },
    };

    const updateProduct = updateProductUsecase(fakeRepository);

    await expect(updateProduct("unknown", { price: 75 })).rejects.toMatchObject(
      { statusCode: 404 },
    );
  });
});
