import { GetAllCategoriesUseCase } from "./get-all-categories.usecase.js";
import { buildCategory } from "../../tests/builders/category.builder.js";
import { InMemoryCategoryRepository } from "../../tests/fakes/in-memory-category.repository.js";

describe("GetAllCategoriesUseCase", () => {
  it("returns the categories provided by the repository", async () => {
    const categories = [
      buildCategory({
        id: "c1",
        slug: "cavalier",
        name: "Cavalier",
        position: 1,
      }),
      buildCategory({ id: "c2", slug: "cheval", name: "Cheval", position: 2 }),
    ];
    const useCase = new GetAllCategoriesUseCase(
      new InMemoryCategoryRepository(categories),
    );

    expect(await useCase.execute()).toEqual(categories);
  });

  it("returns an empty list when there is no category", async () => {
    const useCase = new GetAllCategoriesUseCase(
      new InMemoryCategoryRepository(),
    );

    expect(await useCase.execute()).toEqual([]);
  });
});
