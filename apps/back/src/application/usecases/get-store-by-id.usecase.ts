import { AppError } from "../../api/middlewares/error-handler.middleware.js";
import { IStoreRepository } from "../../domain/interfaces/store-repository.interface.js";

export const getStoreByIdUsecase = (storeRepository: IStoreRepository) => {
  return async (id: string) => {
    const store = await storeRepository.findById(id);

    if (!store) {
      throw new AppError("Store not found", 404);
    }

    return store;
  };
};
