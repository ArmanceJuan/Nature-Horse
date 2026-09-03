import { archiveProductUsecase } from "./archive-product.usecase.js";
import { IProductRepository } from "../../domain/interfaces/product-repository.interface.js";
import { Product } from "../../domain/entities/product.entity.js";

describe("archiveProductUsecase", () => {
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

  it("should archive the product when it exists", async () => {
    const fakeRepository: IProductRepository = {
      findAll: async () => [],
      findById: async () => fakeProduct,
      findByVariantId: async () => null,
      create: async () => fakeProduct,
      update: async () => fakeProduct,
      delete: async () => {},
      updateStatus: async (id, status) => ({ ...fakeProduct, status }),
      adjustStock: async () => fakeProduct,
    };

    const archiveProduct = archiveProductUsecase(fakeRepository);
    const result = await archiveProduct("1");

    expect(result.status).toBe("ARCHIVED");
  });

  it("should throw 404 when product does not exist", async () => {
    const fakeRepository: IProductRepository = {
      findAll: async () => [],
      findById: async () => null,
      findByVariantId: async () => null,
      create: async () => fakeProduct,
      update: async () => fakeProduct,
      delete: async () => {},
      updateStatus: async () => fakeProduct,
      adjustStock: async () => fakeProduct,
    };

    const archiveProduct = archiveProductUsecase(fakeRepository);

    await expect(archiveProduct("unknown")).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});
