import { GetAllProductsUseCase } from "./get-all-products.usecase.js";
import {
  AttributeValue,
  ProductCategory,
} from "../../domain/entities/product.entity.js";
import {
  buildProduct,
  buildVariant,
} from "../../tests/builders/product.builder.js";
import { InMemoryProductRepository } from "../../tests/fakes/in-memory-product.repository.js";

const inStock = { "store-1": 3 };
const outOfStock = { "store-1": 0 };

describe("GetAllProductsUseCase", () => {
  it("returns only the active products that are in stock", async () => {
    const visible = buildProduct({ id: "p1", slug: "visible" });
    const soldOut = buildProduct({
      id: "p2",
      slug: "sold-out",
      variants: [buildVariant({ stockByStore: outOfStock })],
    });
    const archived = buildProduct({
      id: "p3",
      slug: "archived",
      status: "ARCHIVED",
    });
    const useCase = new GetAllProductsUseCase(
      new InMemoryProductRepository([visible, soldOut, archived]),
    );

    const result = await useCase.execute({});

    expect(result.map((product) => product.id)).toEqual(["p1"]);
  });

  it("always asks the repository for active products only", async () => {
    const repository = new InMemoryProductRepository([
      buildProduct({ status: "ARCHIVED" }),
    ]);
    const useCase = new GetAllProductsUseCase(repository);

    const result = await useCase.execute({ status: "ARCHIVED" });

    expect(repository.lastCriteria?.status).toBe("ACTIVE");
    expect(result).toEqual([]);
  });

  it("passes the search criteria to the repository", async () => {
    const repository = new InMemoryProductRepository();
    const useCase = new GetAllProductsUseCase(repository);

    await useCase.execute({
      categorySlug: "soin",
      isNew: true,
      minPrice: 10,
      maxPrice: 50,
    });

    expect(repository.lastCriteria).toMatchObject({
      categorySlug: "soin",
      isNew: true,
      minPrice: 10,
      maxPrice: 50,
    });
  });

  it("filters by category through the repository", async () => {
    const soin = buildProduct({
      id: "p1",
      slug: "spray",
      category: new ProductCategory({ id: "c1", slug: "soin", name: "Soin" }),
    });
    const cheval = buildProduct({
      id: "p2",
      slug: "selle",
      category: new ProductCategory({
        id: "c2",
        slug: "cheval",
        name: "Cheval",
      }),
    });
    const useCase = new GetAllProductsUseCase(
      new InMemoryProductRepository([soin, cheval]),
    );

    const result = await useCase.execute({ categorySlug: "soin" });

    expect(result.map((product) => product.id)).toEqual(["p1"]);
  });

  it("keeps only the products that have one of the requested sizes", async () => {
    const small = buildProduct({
      id: "p1",
      slug: "small",
      variants: [
        buildVariant({
          id: "v1",
          attributeValues: [
            new AttributeValue({ attributeName: "Taille", value: "S" }),
          ],
          stockByStore: inStock,
        }),
      ],
    });
    const large = buildProduct({
      id: "p2",
      slug: "large",
      variants: [
        buildVariant({
          id: "v2",
          attributeValues: [
            new AttributeValue({ attributeName: "Taille", value: "L" }),
          ],
          stockByStore: inStock,
        }),
      ],
    });
    const useCase = new GetAllProductsUseCase(
      new InMemoryProductRepository([small, large]),
    );

    const result = await useCase.execute({ sizes: ["L"] });

    expect(result.map((product) => product.id)).toEqual(["p2"]);
  });

  it("paginates the visible products and applies the default limit", async () => {
    const products = Array.from({ length: 25 }, (_, index) =>
      buildProduct({ id: `p${index}`, slug: `product-${index}` }),
    );
    const useCase = new GetAllProductsUseCase(
      new InMemoryProductRepository(products),
    );

    expect(await useCase.execute({})).toHaveLength(20);
    expect(await useCase.execute({ page: 2, limit: 10 })).toHaveLength(10);
    expect(await useCase.execute({ page: 3, limit: 10 })).toHaveLength(5);
  });
});
