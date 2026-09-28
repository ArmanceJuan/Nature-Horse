export class Pagination {
  static readonly DEFAULT_LIMIT = 20;
  static readonly MAX_LIMIT = 100;

  readonly page: number;
  readonly limit: number;

  private constructor(page: number, limit: number) {
    this.page = page;
    this.limit = limit;
  }

  static of(page?: number, limit?: number): Pagination {
    const safePage =
      page !== undefined && Number.isInteger(page) && page > 0 ? page : 1;
    const safeLimit =
      limit !== undefined &&
      Number.isInteger(limit) &&
      limit > 0 &&
      limit <= Pagination.MAX_LIMIT
        ? limit
        : Pagination.DEFAULT_LIMIT;

    return new Pagination(safePage, safeLimit);
  }

  get offset(): number {
    return (this.page - 1) * this.limit;
  }

  apply<T>(items: T[]): T[] {
    return items.slice(this.offset, this.offset + this.limit);
  }
}
