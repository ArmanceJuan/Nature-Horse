import { Category } from "../../domain/entities/category.entity.js";
import type { CategoryProps } from "../../domain/entities/category.entity.js";

export const buildCategory = (
  overrides: Partial<CategoryProps> = {},
): Category =>
  new Category({
    id: "category-1",
    slug: "cavalier",
    name: "Cavalier",
    position: 1,
    ...overrides,
  });
