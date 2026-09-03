import { adjustStockUsecase } from "./adjust-stock.usecase.js";
import { IProductRepository } from "../../domain/interfaces/product-repository.interface.js";
import { Product } from "../../domain/entities/product.entity.js";

describe("adjustStockUsecase", () => {
  const fakeProduct: Product = {
    id: "1",
    name: "Test",
    description: "desc",
    price: 50,
    collection: "textile-performance",
    discipline: "loisir",
    status: "ACTIVE",
    specs: [],
    shippingInfo: "info",
    isNew: false,
    isPopular: false,
    images: [],
    variants: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const fakeRepository: IProductRepository = {
    findAll: async () => [],
    findById: async () => fakeProduct,
    findByVariantId: async () => null,
    create: async () => fakeProduct,
    update: async () => fakeProduct,
    delete: async () => {},
    updateStatus: async () => fakeProduct,
    adjustStock: async () => fakeProduct,
  };

  it("should adjust stock with a valid quantity", async () => {
    const adjustStock = adjustStockUsecase(fakeRepository);
    const result = await adjustStock("variant-1", "store-1", 10);

    expect(result).toEqual(fakeProduct);
  });

  it("should throw 400 for a negative quantity", async () => {
    const adjustStock = adjustStockUsecase(fakeRepository);

    await expect(adjustStock("variant-1", "store-1", -5)).rejects.toMatchObject(
      { statusCode: 400 },
    );
  });
});
