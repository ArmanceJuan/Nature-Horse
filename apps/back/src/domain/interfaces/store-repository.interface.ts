import type { Store } from "../entities/store.entity.js";

export interface IStoreRepository {
  findAll(): Promise<Store[]>;
  findById(id: string): Promise<Store | null>;
}
