import type { Category } from "../entities/category.entity.js";

export interface ICategoryRepository {
  findAll(): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
}
