import { getAllProductsUsecase } from "./get-all-products.usecase.js";
import { IProductRepository } from "../../domain/interfaces/product-repository.interface.js";
import { Product } from "../../domain/entities/product.entity.js";

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
    },
  ];

  it("should return products from the repository", async () => {
    const fakeRepository: IProductRepository = {
      findAll: async () => fakeProducts,
      findById: async () => null,
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
    };

    const getAllProducts = getAllProductsUsecase(fakeRepository);
    await getAllProducts({ collection: "haute-sellerie" });

    expect(receivedFilters).toEqual({ collection: "haute-sellerie" });
  });
});
