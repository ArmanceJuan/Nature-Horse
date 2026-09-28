import type { Store } from "../../domain/entities/store.entity.js";
import type { IStoreRepository } from "../../domain/interfaces/store-repository.interface.js";

export class GetAllStoresUseCase {
  private readonly storeRepository: IStoreRepository;

  constructor(storeRepository: IStoreRepository) {
    this.storeRepository = storeRepository;
  }

  execute(): Promise<Store[]> {
    return this.storeRepository.findAll();
  }
}
