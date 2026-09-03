import { cancelOrderUsecase } from "../../application/usecases/cancel-order.usecase.js";
import { createOrderUsecase } from "../../application/usecases/create-order.usecase.js";
import { createProductUsecase } from "../../application/usecases/create-product.usecase.js";
import { deleteProductUsecase } from "../../application/usecases/delete-product.usecase.js";
import { enableOtpUsecase } from "../../application/usecases/enable-otp.usecase.js";
import { generateOtpSecretUsecase } from "../../application/usecases/generate-otp-secret.usecase.js";
import { getAllOrdersUsecase } from "../../application/usecases/get-all-orders.usecase.js";
import { getAllProductsUsecase } from "../../application/usecases/get-all-products.usecase.js";
import { getAllStoresUsecase } from "../../application/usecases/get-all-stores.usecase.js";
import { getAllUsersUsecase } from "../../application/usecases/get-all-users.usecase.js";
import { getMyOrdersUsecase } from "../../application/usecases/get-my-orders.usecase.js";
import { getOrderByIdUsecase } from "../../application/usecases/get-order-by-id.usecase.js";
import { getProductByIdUsecase } from "../../application/usecases/get-product-by-id.usecase.js";
import { getStoreByIdUsecase } from "../../application/usecases/get-store-by-id.usecase.js";
import { loginUserUsecase } from "../../application/usecases/login-user.usecase.js";
import { registerUserUsecase } from "../../application/usecases/register-user.usecase.js";
import { updateOrderStatusUsecase } from "../../application/usecases/update-order-status.usecase.js";
import { updateProductUsecase } from "../../application/usecases/update-product.usecase.js";
import { orderPrismaRepository } from "../../infrastructure/repositories/order-prisma.repository.js";
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
export const updateProduct = updateProductUsecase(productPrismaRepository);
export const deleteProduct = deleteProductUsecase(productPrismaRepository);
export const createOrder = createOrderUsecase(
  orderPrismaRepository,
  productPrismaRepository,
);
export const getMyOrders = getMyOrdersUsecase(orderPrismaRepository);
export const getAllOrders = getAllOrdersUsecase(orderPrismaRepository);
export const getOrderById = getOrderByIdUsecase(orderPrismaRepository);
export const updateOrderStatus = updateOrderStatusUsecase(
  orderPrismaRepository,
);
export const cancelOrder = cancelOrderUsecase(orderPrismaRepository);
