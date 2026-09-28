import { buildStore } from "../../tests/builders/store.builder.js";

describe("Store", () => {
  it("builds its full address from the address, the postal code and the city", () => {
    const store = buildStore({
      address: "20 Av. Louis Boudin",
      postalCode: "84800",
      city: "Isle sur la Sorgue",
    });

    expect(store.fullAddress).toBe(
      "20 Av. Louis Boudin, 84800 Isle sur la Sorgue",
    );
  });

  it("does not serialize the computed address", () => {
    const serialized = JSON.parse(JSON.stringify(buildStore()));

    expect(serialized).not.toHaveProperty("fullAddress");
    expect(serialized).toHaveProperty("city");
  });
});
