import { IStoreRepository } from "../../domain/interfaces/store-repository.interface.js";

export const getAllStoresUsecase = (storeRepository: IStoreRepository) => {
  return async () => {
    return storeRepository.findAll();
  };
};
