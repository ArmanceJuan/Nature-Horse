import { createProductUsecase } from "../../application/usecases/create-product.usecase.js";
import { enableOtpUsecase } from "../../application/usecases/enable-otp.usecase.js";
import { generateOtpSecretUsecase } from "../../application/usecases/generate-otp-secret.usecase.js";
import { getAllProductsUsecase } from "../../application/usecases/get-all-products.usecase.js";
import { getAllStoresUsecase } from "../../application/usecases/get-all-stores.usecase.js";
import { getAllUsersUsecase } from "../../application/usecases/get-all-users.usecase.js";
import { getProductByIdUsecase } from "../../application/usecases/get-product-by-id.usecase.js";
import { getStoreByIdUsecase } from "../../application/usecases/get-store-by-id.usecase.js";
import { loginUserUsecase } from "../../application/usecases/login-user.usecase.js";
import { registerUserUsecase } from "../../application/usecases/register-user.usecase.js";
import { otpBackupCodePrismaRepository } from "../../infrastructure/repositories/otp-backup-code-prisma.repository.js";
import { productPrismaRepository } from "../../infrastructure/repositories/product-prisma.repository.js";
import { storePrismaRepository } from "../../infrastructure/repositories/store-prisma.repository.js";
import { userPrismaRepository } from "../../infrastructure/repositories/user-prisma.repository.js";
import { QrCodeGenerator } from "../../infrastructure/security/qr-code-generator.util.js";

const qrCodeGenerator = new QrCodeGenerator(
  process.env.APP_NAME || "Nature Horse",
);

export const getAllUsers = getAllUsersUsecase(userPrismaRepository);
export const registerUser = registerUserUsecase(userPrismaRepository);
export const loginUser = loginUserUsecase(userPrismaRepository);
export const generateOtpSecret = generateOtpSecretUsecase(
  userPrismaRepository,
  qrCodeGenerator,
);
export const enableOtp = enableOtpUsecase(
  userPrismaRepository,
  otpBackupCodePrismaRepository,
);
export const getAllProducts = getAllProductsUsecase(productPrismaRepository);
export const getProductById = getProductByIdUsecase(productPrismaRepository);
export const getAllStores = getAllStoresUsecase(storePrismaRepository);
export const getStoreById = getStoreByIdUsecase(storePrismaRepository);
export const createProduct = createProductUsecase(productPrismaRepository);
