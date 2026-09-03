import { getAllProductsUsecase } from "./get-all-products.usecase.js";
import { IProductRepository } from "../../domain/interfaces/product-repository.interface.js";
import {
  Product,
  ProductStatus,
} from "../../domain/entities/product.entity.js";
import { CreateProductInput } from "../../domain/entities/create-product-input.entity.js";
import { UpdateProductInput } from "../../domain/entities/update-product-input.entity.js";

describe("getAllProductsUsecase", () => {
  const fakeProducts: Product[] = [
    {
      id: "1",
      name: "Test Product",
      description: "desc",
      price: 100,
      collection: "haute-sellerie",
      discipline: "dressage",
      specs: [],
      shippingInfo: "info",
      isNew: false,
      isPopular: false,
      images: [],
      variants: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "ACTIVE",
    },
  ];

  it("should return products from the repository", async () => {
    const fakeRepository: IProductRepository = {
      findAll: async () => fakeProducts,
      findById: async () => null,
      findByVariantId: function (variantId: string): Promise<Product | null> {
        throw new Error("Function not implemented.");
      },
      create: function (data: CreateProductInput): Promise<Product> {
        throw new Error("Function not implemented.");
      },
      update: function (
        id: string,
        data: UpdateProductInput,
      ): Promise<Product> {
        throw new Error("Function not implemented.");
      },
      delete: function (id: string): Promise<void> {
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

    const getAllProducts = getAllProductsUsecase(fakeRepository);
    const result = await getAllProducts({});

    expect(result).toEqual(fakeProducts);
  });

  it("should pass filters to the repository", async () => {
    let receivedFilters: unknown = null;

    const fakeRepository: IProductRepository = {
      findAll: async (filters) => {
        receivedFilters = filters;
        return fakeProducts;
      },
      findById: async () => null,
      findByVariantId: function (variantId: string): Promise<Product | null> {
        throw new Error("Function not implemented.");
      },
      create: function (data: CreateProductInput): Promise<Product> {
        throw new Error("Function not implemented.");
      },
      update: function (
        id: string,
        data: UpdateProductInput,
      ): Promise<Product> {
        throw new Error("Function not implemented.");
      },
      delete: function (id: string): Promise<void> {
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

    const getAllProducts = getAllProductsUsecase(fakeRepository);
    await getAllProducts({ collection: "haute-sellerie" });

    expect(receivedFilters).toEqual({ collection: "haute-sellerie" });
  });
});
