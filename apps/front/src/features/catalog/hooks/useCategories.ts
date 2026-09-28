import { useEffect, useState } from "react";
import { categoriesApi } from "../api/categoriesApi.js";
import type { Category } from "../types/product.types.js";

let cachedRequest: Promise<Category[]> | null = null;

const loadCategories = (): Promise<Category[]> => {
  if (cachedRequest === null) {
    cachedRequest = categoriesApi.getAll().catch((error: unknown) => {
      cachedRequest = null;
      throw error;
    });
  }

  return cachedRequest;
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    loadCategories()
      .then((result) => {
        if (!isCancelled) setCategories(result);
      })
      .catch(() => {
        if (!isCancelled) setCategories([]);
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  return { categories, isLoading };
};
