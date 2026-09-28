import type { Category } from "../types/product.types.js";

export interface ShopNavItem {
  label: string;
  to: string;
}

export const ALL_PRODUCTS_ITEM: ShopNavItem = {
  label: "Voir tout",
  to: "/shop",
};

export const NEW_PRODUCTS_ITEM: ShopNavItem = {
  label: "Nouveautés",
  to: "/shop?new=true",
};

export const buildCategoryItems = (categories: Category[]): ShopNavItem[] =>
  categories.map((category) => ({
    label: category.name,
    to: `/shop?category=${category.slug}`,
  }));

export const isNavItemActive = (item: ShopNavItem, search: string): boolean => {
  const expected = new URLSearchParams(item.to.split("?")[1] ?? "");
  const current = new URLSearchParams(search);

  let hasParams = false;
  let allMatch = true;

  expected.forEach((value, key) => {
    hasParams = true;
    if (current.get(key) !== value) {
      allMatch = false;
    }
  });

  return hasParams && allMatch;
};
