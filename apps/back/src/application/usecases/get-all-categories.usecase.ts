import type { Category } from "../../domain/entities/category.entity.js";
import type { ICategoryRepository } from "../../domain/interfaces/category-repository.interface.js";

export class GetAllCategoriesUseCase {
  private readonly categoryRepository: ICategoryRepository;

  constructor(categoryRepository: ICategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  execute(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }
}
