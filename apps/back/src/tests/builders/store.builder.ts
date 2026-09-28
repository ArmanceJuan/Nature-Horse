import { Store } from "../../domain/entities/store.entity.js";
import type { StoreProps } from "../../domain/entities/store.entity.js";

export const buildStore = (overrides: Partial<StoreProps> = {}): Store =>
  new Store({
    id: "store-1",
    name: "Nature Horse - Test",
    address: "1 rue du Test",
    postalCode: "13000",
    city: "Marseille",
    phone: null,
    email: null,
    openingHours: ["Lun - Sam : 10h-19h"],
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    ...overrides,
  });
