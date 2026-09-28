import type { Store } from "../../domain/entities/store.entity.js";
import type { IStoreRepository } from "../../domain/interfaces/store-repository.interface.js";

export class InMemoryStoreRepository implements IStoreRepository {
  private readonly stores: Store[];

  constructor(stores: Store[] = []) {
    this.stores = stores;
  }

  async findAll(): Promise<Store[]> {
    return [...this.stores];
  }

  async findById(id: string): Promise<Store | null> {
    return this.stores.find((store) => store.id === id) ?? null;
  }
}
