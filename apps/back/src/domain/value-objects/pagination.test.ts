import { Pagination } from "./pagination.js";

describe("Pagination", () => {
  it("uses the first page and the default limit when nothing is given", () => {
    const pagination = Pagination.of();

    expect(pagination.page).toBe(1);
    expect(pagination.limit).toBe(Pagination.DEFAULT_LIMIT);
  });

  it("keeps a valid page and limit", () => {
    const pagination = Pagination.of(3, 10);

    expect(pagination.page).toBe(3);
    expect(pagination.limit).toBe(10);
    expect(pagination.offset).toBe(20);
  });

  it("falls back to the defaults for invalid values", () => {
    expect(Pagination.of(0, 0).page).toBe(1);
    expect(Pagination.of(-2, -5).limit).toBe(Pagination.DEFAULT_LIMIT);
    expect(Pagination.of(1.5, 2.5).limit).toBe(Pagination.DEFAULT_LIMIT);
  });

  it("refuses a limit above the maximum", () => {
    expect(Pagination.of(1, Pagination.MAX_LIMIT + 1).limit).toBe(
      Pagination.DEFAULT_LIMIT,
    );
    expect(Pagination.of(1, Pagination.MAX_LIMIT).limit).toBe(
      Pagination.MAX_LIMIT,
    );
  });

  it("returns only the requested slice", () => {
    const items = [1, 2, 3, 4, 5, 6, 7];

    expect(Pagination.of(2, 3).apply(items)).toEqual([4, 5, 6]);
    expect(Pagination.of(3, 3).apply(items)).toEqual([7]);
    expect(Pagination.of(4, 3).apply(items)).toEqual([]);
  });
});
