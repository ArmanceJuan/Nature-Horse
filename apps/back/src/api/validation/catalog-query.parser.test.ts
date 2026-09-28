import { CatalogQueryParser } from "./catalog-query.parser.js";

describe("CatalogQueryParser", () => {
  const parser = new CatalogQueryParser();

  it("reads every supported parameter", () => {
    const filters = parser.parse({
      collection: "haute-sellerie",
      discipline: "dressage",
      category: "soin",
      isNew: "true",
      search: "selle",
      minPrice: "10",
      maxPrice: "200.5",
      sizes: "S, M ,L",
      page: "2",
      limit: "10",
    });

    expect(filters).toEqual({
      collection: "haute-sellerie",
      discipline: "dressage",
      categorySlug: "soin",
      isNew: true,
      search: "selle",
      minPrice: 10,
      maxPrice: 200.5,
      sizes: ["S", "M", "L"],
      page: 2,
      limit: 10,
    });
  });

  it("returns no filter for an empty query", () => {
    expect(parser.parse({})).toEqual({});
  });

  it("does not fail when the query is not an object", () => {
    expect(parser.parse(undefined)).toEqual({});
  });

  it("ignores invalid numbers", () => {
    const filters = parser.parse({
      minPrice: "abc",
      maxPrice: "-5",
      page: "0",
      limit: "2.5",
    });

    expect(filters).toEqual({});
  });

  it("only sets isNew when the value is true", () => {
    expect(parser.parse({ isNew: "false" }).isNew).toBeUndefined();
    expect(parser.parse({ isNew: "true" }).isNew).toBe(true);
  });

  it("ignores values that are not plain text", () => {
    expect(parser.parse({ category: ["a", "b"], search: { x: 1 } })).toEqual(
      {},
    );
  });

  it("cuts an overly long text", () => {
    expect(parser.parse({ search: "x".repeat(300) }).search).toHaveLength(100);
  });

  it("ignores empty items in the size list", () => {
    expect(parser.parse({ sizes: " , ,L," }).sizes).toEqual(["L"]);
  });
});
