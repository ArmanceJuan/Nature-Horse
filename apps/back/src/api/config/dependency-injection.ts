import { getAllUsersUsecase } from "../../application/usecases/get-all-users.usecase.js";
import { userPrismaRepository } from "../../infrastructure/repositories/user-prisma.repository.js";

export const getAllUsers = getAllUsersUsecase(userPrismaRepository);
