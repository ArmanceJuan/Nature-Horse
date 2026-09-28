import type { Store } from "../../domain/entities/store.entity.js";
import { NotFoundError } from "../../domain/errors/http-errors.js";
import type { IStoreRepository } from "../../domain/interfaces/store-repository.interface.js";

export class GetStoreByIdUseCase {
  private readonly storeRepository: IStoreRepository;

  constructor(storeRepository: IStoreRepository) {
    this.storeRepository = storeRepository;
  }

  async execute(id: string): Promise<Store> {
    const store = await this.storeRepository.findById(id);

    if (!store) {
      throw new NotFoundError("Store not found");
    }

    return store;
  }
}
