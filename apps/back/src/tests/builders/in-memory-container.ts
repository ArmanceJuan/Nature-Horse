import { GetAllCategoriesUseCase } from "../../application/usecases/get-all-categories.usecase.js";
import { GetAllStoresUseCase } from "../../application/usecases/get-all-stores.usecase.js";
import { GetStoreByIdUseCase } from "../../application/usecases/get-store-by-id.usecase.js";
import { GetAllProductsUseCase } from "../../application/usecases/get-all-products.usecase.js";
import { GetProductByIdUseCase } from "../../application/usecases/get-product-by-id.usecase.js";
import { CreateProductUseCase } from "../../application/usecases/create-product.usecase.js";
import { UpdateProductUseCase } from "../../application/usecases/update-product.usecase.js";
import { DeleteProductUseCase } from "../../application/usecases/delete-product.usecase.js";
import { ArchiveProductUseCase } from "../../application/usecases/archive-product.usecase.js";
import { ReactivateProductUseCase } from "../../application/usecases/reactivate-product.usecase.js";
import { AdjustStockUseCase } from "../../application/usecases/adjust-stock.usecase.js";
import { GetAllUsersUseCase } from "../../application/usecases/get-all-users.usecase.js";
import { RegisterUserUseCase } from "../../application/usecases/register-user.usecase.js";
import { LoginUserUseCase } from "../../application/usecases/login-user.usecase.js";
import { GetCurrentUserUseCase } from "../../application/usecases/get-current-user.usecase.js";
import { GenerateOtpSecretUseCase } from "../../application/usecases/generate-otp-secret.usecase.js";
import { EnableOtpUseCase } from "../../application/usecases/enable-otp.usecase.js";
import { CreateOrderUseCase } from "../../application/usecases/create-order.usecase.js";
import { GetMyOrdersUseCase } from "../../application/usecases/get-my-orders.usecase.js";
import { GetAllOrdersUseCase } from "../../application/usecases/get-all-orders.usecase.js";
import { GetOrderByIdUseCase } from "../../application/usecases/get-order-by-id.usecase.js";
import { GetOrderByTrackingTokenUseCase } from "../../application/usecases/get-order-by-tracking-token.usecase.js";
import { UpdateOrderStatusUseCase } from "../../application/usecases/update-order-status.usecase.js";
import { CancelOrderUseCase } from "../../application/usecases/cancel-order.usecase.js";
import { CancelOrderByTrackingTokenUseCase } from "../../application/usecases/cancel-order-by-tracking-token.usecase.js";
import { ConfirmOrderPaymentUseCase } from "../../application/usecases/confirm-order-payment.usecase.js";
import { ExpireOrderPaymentUseCase } from "../../application/usecases/expire-order-payment.usecase.js";
import { DisableOtpUseCase } from "../../application/usecases/disable-otp.usecase.js";
import type { Category } from "../../domain/entities/category.entity.js";
import type { Product } from "../../domain/entities/product.entity.js";
import type { Store } from "../../domain/entities/store.entity.js";
import type { User } from "../../domain/entities/user.entity.js";
import type { Container } from "../../api/config/container.js";
import { CategoryController } from "../../api/controllers/category.controller.js";
import { StoreController } from "../../api/controllers/store.controller.js";
import { ProductController } from "../../api/controllers/product.controller.js";
import { UserController } from "../../api/controllers/user.controller.js";
import { AuthController } from "../../api/controllers/auth.controller.js";
import { OtpController } from "../../api/controllers/otp.controller.js";
import { OrderController } from "../../api/controllers/order.controller.js";
import { PaymentWebhookController } from "../../api/controllers/payment-webhook.controller.js";
import { CategoryRoutes } from "../../api/routes/category.routes.js";
import { StoreRoutes } from "../../api/routes/store.routes.js";
import { ProductRoutes } from "../../api/routes/product.routes.js";
import { UserRoutes } from "../../api/routes/user.routes.js";
import { AuthRoutes } from "../../api/routes/auth.routes.js";
import { OtpRoutes } from "../../api/routes/otp.routes.js";
import { OrderRoutes } from "../../api/routes/order.routes.js";
import { PaymentRoutes } from "../../api/routes/payment.routes.js";
import { SessionCookie } from "../../api/http/session-cookie.js";
import { CatalogQueryParser } from "../../api/validation/catalog-query.parser.js";
import { CreateProductValidator } from "../../api/validation/create-product.validator.js";
import { UpdateProductValidator } from "../../api/validation/update-product.validator.js";
import { AdjustStockValidator } from "../../api/validation/adjust-stock.validator.js";
import { RegisterValidator } from "../../api/validation/register.validator.js";
import { LoginValidator } from "../../api/validation/login.validator.js";
import { EnableOtpValidator } from "../../api/validation/enable-otp.validator.js";
import { CreateOrderValidator } from "../../api/validation/create-order.validator.js";
import { UpdateOrderStatusValidator } from "../../api/validation/update-order-status.validator.js";
import { DisableOtpValidator } from "../../api/validation/disable-otp.validator.js";
import { FakeGuards } from "../fakes/fake-guards.js";
import { FakeBackupCodeGenerator } from "../fakes/fake-backup-code.generator.js";
import { FakePasswordHasher } from "../fakes/fake-password-hasher.js";
import { FakePaymentService } from "../fakes/fake-payment.service.js";
import { FakeQrCodeGenerator } from "../fakes/fake-qr-code.generator.js";
import { FakeTokenService } from "../fakes/fake-token.service.js";
import { FakeTotpService } from "../fakes/fake-totp.service.js";
import { FakeTrackingTokenGenerator } from "../fakes/fake-tracking-token.generator.js";
import { FixedClock } from "../fakes/fixed-clock.js";
import { InMemoryCategoryRepository } from "../fakes/in-memory-category.repository.js";
import { InMemoryOrderRepository } from "../fakes/in-memory-order.repository.js";
import { InMemoryProductRepository } from "../fakes/in-memory-product.repository.js";
import { InMemoryStoreRepository } from "../fakes/in-memory-store.repository.js";
import { InMemoryTwoFactorRepository } from "../fakes/in-memory-two-factor.repository.js";
import { InMemoryUserRepository } from "../fakes/in-memory-user.repository.js";

export interface InMemorySeed {
  categories?: Category[];
  stores?: Store[];
  products?: Product[];
  users?: User[];
}

export const buildInMemoryContainer = (seed: InMemorySeed = {}): Container => {
  const categoryRepository = new InMemoryCategoryRepository(
    seed.categories ?? [],
  );
  const storeRepository = new InMemoryStoreRepository(seed.stores ?? []);
  const productRepository = new InMemoryProductRepository(seed.products ?? []);
  const userRepository = new InMemoryUserRepository(seed.users ?? []);
  const twoFactorRepository = new InMemoryTwoFactorRepository();
  const paymentService = new FakePaymentService();
  const orderRepository = new InMemoryOrderRepository(
    [],
    {},
    productRepository,
  );

  const passwordHasher = new FakePasswordHasher();
  const tokenService = new FakeTokenService();
  const totpService = new FakeTotpService();
  const backupCodeGenerator = new FakeBackupCodeGenerator();
  const qrCodeGenerator = new FakeQrCodeGenerator();
  const trackingTokenGenerator = new FakeTrackingTokenGenerator();
  const clock = new FixedClock(new Date("2026-01-01T10:00:00.000Z"));
  const sessionCookie = new SessionCookie(false);
  const guards = new FakeGuards();

  const categoryController = new CategoryController(
    new GetAllCategoriesUseCase(categoryRepository),
  );

  const storeController = new StoreController(
    new GetAllStoresUseCase(storeRepository),
    new GetStoreByIdUseCase(storeRepository),
  );

  const productController = new ProductController({
    getAllProducts: new GetAllProductsUseCase(productRepository),
    getProductById: new GetProductByIdUseCase(productRepository),
    createProduct: new CreateProductUseCase(
      productRepository,
      categoryRepository,
      storeRepository,
    ),
    updateProduct: new UpdateProductUseCase(
      productRepository,
      categoryRepository,
    ),
    deleteProduct: new DeleteProductUseCase(productRepository),
    archiveProduct: new ArchiveProductUseCase(productRepository),
    reactivateProduct: new ReactivateProductUseCase(productRepository),
    adjustStock: new AdjustStockUseCase(productRepository, storeRepository),
    catalogQueryParser: new CatalogQueryParser(),
    createProductValidator: new CreateProductValidator(),
    updateProductValidator: new UpdateProductValidator(),
    adjustStockValidator: new AdjustStockValidator(),
  });

  const userController = new UserController(
    new GetAllUsersUseCase(userRepository),
  );

  const authController = new AuthController({
    registerUser: new RegisterUserUseCase(userRepository, passwordHasher),
    loginUser: new LoginUserUseCase(
      userRepository,
      passwordHasher,
      totpService,
      tokenService,
      twoFactorRepository,
    ),
    getCurrentUser: new GetCurrentUserUseCase(userRepository),
    registerValidator: new RegisterValidator(),
    loginValidator: new LoginValidator(),
    sessionCookie,
  });

  const otpController = new OtpController({
    generateOtpSecret: new GenerateOtpSecretUseCase(
      userRepository,
      totpService,
      qrCodeGenerator,
    ),
    enableOtp: new EnableOtpUseCase(
      userRepository,
      twoFactorRepository,
      totpService,
      backupCodeGenerator,
      passwordHasher,
    ),
    enableOtpValidator: new EnableOtpValidator(),
    disableOtp: new DisableOtpUseCase(
      userRepository,
      twoFactorRepository,
      passwordHasher,
    ),
    disableOtpValidator: new DisableOtpValidator(),
  });

  const getOrderByTrackingToken = new GetOrderByTrackingTokenUseCase(
    orderRepository,
  );

  const orderController = new OrderController({
    createOrder: new CreateOrderUseCase(
      orderRepository,
      productRepository,
      storeRepository,
      userRepository,
      trackingTokenGenerator,
      clock,
      paymentService,
      "http://localhost:5173",
    ),
    getMyOrders: new GetMyOrdersUseCase(orderRepository),
    getAllOrders: new GetAllOrdersUseCase(orderRepository),
    getOrderById: new GetOrderByIdUseCase(orderRepository),
    getOrderByTrackingToken,
    updateOrderStatus: new UpdateOrderStatusUseCase(orderRepository),
    cancelOrder: new CancelOrderUseCase(orderRepository),
    cancelOrderByTrackingToken: new CancelOrderByTrackingTokenUseCase(
      getOrderByTrackingToken,
      orderRepository,
    ),
    createOrderValidator: new CreateOrderValidator(),
    updateOrderStatusValidator: new UpdateOrderStatusValidator(),
  });

  const paymentWebhookController = new PaymentWebhookController(
    paymentService,
    new ConfirmOrderPaymentUseCase(orderRepository),
    new ExpireOrderPaymentUseCase(orderRepository),
  );

  return {
    guards,
    productRepository,
    categoryRoutes: new CategoryRoutes(categoryController),
    storeRoutes: new StoreRoutes(storeController),
    productRoutes: new ProductRoutes(productController, guards),
    userRoutes: new UserRoutes(userController, guards),
    authRoutes: new AuthRoutes(authController, guards),
    otpRoutes: new OtpRoutes(otpController, guards),
    orderRoutes: new OrderRoutes(orderController, guards),
    paymentRoutes: new PaymentRoutes(paymentWebhookController),
  } as Container;
};
