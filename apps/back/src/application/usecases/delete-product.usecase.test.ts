import { deleteProductUsecase } from "./delete-product.usecase.js";
import { IProductRepository } from "../../domain/interfaces/product-repository.interface.js";
import { Product } from "../../domain/entities/product.entity.js";

describe("deleteProductUsecase", () => {
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
  };

  it("should delete the product when it exists", async () => {
    let deleteWasCalled = false;

    const fakeRepository: IProductRepository = {
      findAll: async () => [],
      findById: async () => fakeProduct,
      create: async () => fakeProduct,
      update: async () => fakeProduct,
      delete: async () => {
        deleteWasCalled = true;
      },
      findByVariantId: function (variantId: string): Promise<Product | null> {
        throw new Error("Function not implemented.");
      },
    };

    const deleteProduct = deleteProductUsecase(fakeRepository);
    await deleteProduct("1");

    expect(deleteWasCalled).toBe(true);
  });

  it("should throw 404 when product does not exist", async () => {
    const fakeRepository: IProductRepository = {
      findAll: async () => [],
      findById: async () => null,
      create: async () => fakeProduct,
      update: async () => fakeProduct,
      delete: async () => {},
      findByVariantId: function (variantId: string): Promise<Product | null> {
        throw new Error("Function not implemented.");
      },
    };

    const deleteProduct = deleteProductUsecase(fakeRepository);

    await expect(deleteProduct("unknown")).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});
