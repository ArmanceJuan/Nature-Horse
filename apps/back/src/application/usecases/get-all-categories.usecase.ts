import { ICategoryRepository } from "../../domain/interfaces/category-repository.interface.js";

export const getAllCategoriesUsecase = (
  categoryRepository: ICategoryRepository,
) => {
  return async () => {
    return categoryRepository.findAll();
  };
};
