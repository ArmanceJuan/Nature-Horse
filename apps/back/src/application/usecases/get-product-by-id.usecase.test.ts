import { getProductByIdUsecase } from "./get-product-by-id.usecase.js";
import { IProductRepository } from "../../domain/interfaces/product-repository.interface.js";
import { Product } from "../../domain/entities/product.entity.js";

describe("getProductByIdUsecase", () => {
  const fakeProduct: Product = {
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
  };

  it("should return the product when found", async () => {
    const fakeRepository: IProductRepository = {
      findAll: async () => [],
      findById: async () => fakeProduct,
      create: async () => fakeProduct,
    };

    const getProductById = getProductByIdUsecase(fakeRepository);
    const result = await getProductById("1");

    expect(result).toEqual(fakeProduct);
  });

  it("should throw 404 when product does not exist", async () => {
    const fakeRepository: IProductRepository = {
      findAll: async () => [],
      findById: async () => null,
      create: async () => fakeProduct,
    };

    const getProductById = getProductByIdUsecase(fakeRepository);

    await expect(getProductById("unknown")).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});
