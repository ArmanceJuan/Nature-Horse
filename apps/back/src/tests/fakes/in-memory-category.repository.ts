import type { Category } from "../../domain/entities/category.entity.js";
import type { ICategoryRepository } from "../../domain/interfaces/category-repository.interface.js";

export class InMemoryCategoryRepository implements ICategoryRepository {
  private readonly categories: Category[];

  constructor(categories: Category[] = []) {
    this.categories = categories;
  }

  async findAll(): Promise<Category[]> {
    return [...this.categories];
  }

  async findById(id: string): Promise<Category | null> {
    return this.categories.find((category) => category.id === id) ?? null;
  }
}
