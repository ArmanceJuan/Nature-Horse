import { Category } from "../entities/category.entity.js";

export interface ICategoryRepository {
  findAll: () => Promise<Category[]>;
}
