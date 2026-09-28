import type { ProductFilters } from "../../domain/entities/product-filters.entity.js";
import type { IValidator } from "./validator.js";

export class CatalogQueryParser implements IValidator<ProductFilters> {
  parse(query: unknown): ProductFilters {
    const source =
      typeof query === "object" && query !== null
        ? (query as Record<string, unknown>)
        : {};

    return {
      collection: this.text(source.collection),
      discipline: this.text(source.discipline),
      categorySlug: this.text(source.category),
      isNew: source.isNew === "true" ? true : undefined,
      search: this.text(source.search),
      minPrice: this.price(source.minPrice),
      maxPrice: this.price(source.maxPrice),
      sizes: this.list(source.sizes),
      page: this.positiveInteger(source.page),
      limit: this.positiveInteger(source.limit),
    };
  }

  private text(value: unknown): string | undefined {
    return typeof value === "string" && value !== ""
      ? value.slice(0, 100)
      : undefined;
  }

  private price(value: unknown): number | undefined {
    if (typeof value !== "string") return undefined;

    const parsed = Number(value);

    return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
  }

  private positiveInteger(value: unknown): number | undefined {
    if (typeof value !== "string") return undefined;

    const parsed = Number(value);

    return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
  }

  private list(value: unknown): string[] | undefined {
    if (typeof value !== "string") return undefined;

    const entries = value
      .split(",")
      .map((entry) => entry.trim())
      .filter((entry) => entry !== "");

    return entries.length > 0 ? entries : undefined;
  }
}
