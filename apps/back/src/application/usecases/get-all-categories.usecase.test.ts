import { getAllCategoriesUsecase } from "./get-all-categories.usecase.js";
import { ICategoryRepository } from "../../domain/interfaces/category-repository.interface.js";

describe("getAllCategoriesUsecase", () => {
  it("returns the categories provided by the repository", async () => {
    const categories = [
      { id: "1", slug: "cavalier", name: "Cavalier", position: 1 },
      { id: "2", slug: "cheval", name: "Cheval", position: 2 },
    ];
    const repository: ICategoryRepository = { findAll: async () => categories };

    const getAllCategories = getAllCategoriesUsecase(repository);

    expect(await getAllCategories()).toEqual(categories);
  });
});
