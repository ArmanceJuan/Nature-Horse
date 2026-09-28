import { slugify } from "./slugify.util.js";

describe("slugify", () => {
  it("removes accents and lowercases", () => {
    expect(slugify("Étrivières Cuir Premium")).toBe("etrivieres-cuir-premium");
  });

  it("replaces symbols and repeated spaces by a single dash", () => {
    expect(slugify("Selle  Monolith / Veau !")).toBe("selle-monolith-veau");
  });

  it("falls back to a default value when nothing usable remains", () => {
    expect(slugify("???")).toBe("produit");
  });
});
