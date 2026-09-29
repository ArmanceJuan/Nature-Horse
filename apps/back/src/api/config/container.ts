import { prisma } from "../../config/prisma.js";
import { AdjustStockUseCase } from "../../application/usecases/adjust-stock.usecase.js";
import { ArchiveProductUseCase } from "../../application/usecases/archive-product.usecase.js";
import { CancelOrderByTrackingTokenUseCase } from "../../application/usecases/cancel-order-by-tracking-token.usecase.js";
import { CancelOrderUseCase } from "../../application/usecases/cancel-order.usecase.js";
import { CreateOrderUseCase } from "../../application/usecases/create-order.usecase.js";
import { CreateProductUseCase } from "../../application/usecases/create-product.usecase.js";
import { DeleteProductUseCase } from "../../application/usecases/delete-product.usecase.js";
import { EnableOtpUseCase } from "../../application/usecases/enable-otp.usecase.js";
import { GenerateOtpSecretUseCase } from "../../application/usecases/generate-otp-secret.usecase.js";
import { GetAllCategoriesUseCase } from "../../application/usecases/get-all-categories.usecase.js";
import { GetAllOrdersUseCase } from "../../application/usecases/get-all-orders.usecase.js";
import { GetAllProductsUseCase } from "../../application/usecases/get-all-products.usecase.js";
import { GetAllStoresUseCase } from "../../application/usecases/get-all-stores.usecase.js";
import { GetAllUsersUseCase } from "../../application/usecases/get-all-users.usecase.js";
import { GetCurrentUserUseCase } from "../../application/usecases/get-current-user.usecase.js";
import { GetMyOrdersUseCase } from "../../application/usecases/get-my-orders.usecase.js";
import { GetOrderByIdUseCase } from "../../application/usecases/get-order-by-id.usecase.js";
import { GetOrderByTrackingTokenUseCase } from "../../application/usecases/get-order-by-tracking-token.usecase.js";
import { GetProductByIdUseCase } from "../../application/usecases/get-product-by-id.usecase.js";
import { GetStoreByIdUseCase } from "../../application/usecases/get-store-by-id.usecase.js";
import { LoginUserUseCase } from "../../application/usecases/login-user.usecase.js";
import { ReactivateProductUseCase } from "../../application/usecases/reactivate-product.usecase.js";
import { RegisterUserUseCase } from "../../application/usecases/register-user.usecase.js";
import { UpdateOrderStatusUseCase } from "../../application/usecases/update-order-status.usecase.js";
import { UpdateProductUseCase } from "../../application/usecases/update-product.usecase.js";
import { CategoryPrismaRepository } from "../../infrastructure/repositories/category-prisma.repository.js";
import { OrderPrismaRepository } from "../../infrastructure/repositories/order-prisma.repository.js";
import { ProductPrismaRepository } from "../../infrastructure/repositories/product-prisma.repository.js";
import { StorePrismaRepository } from "../../infrastructure/repositories/store-prisma.repository.js";
import { TwoFactorPrismaRepository } from "../../infrastructure/repositories/two-factor-prisma.repository.js";
import { UserPrismaRepository } from "../../infrastructure/repositories/user-prisma.repository.js";
import { BcryptPasswordHasher } from "../../infrastructure/security/bcrypt-password-hasher.js";
import { JwtTokenService } from "../../infrastructure/security/jwt-token.service.js";
import { OtplibTotpService } from "../../infrastructure/security/otplib-totp.service.js";
import { QrCodeGenerator } from "../../infrastructure/security/qr-code.generator.js";
import { RandomBackupCodeGenerator } from "../../infrastructure/security/random-backup-code.generator.js";
import { RandomTrackingTokenGenerator } from "../../infrastructure/security/random-tracking-token.generator.js";
import { SystemClock } from "../../infrastructure/system/system-clock.js";
import { AuthController } from "../controllers/auth.controller.js";
import { CategoryController } from "../controllers/category.controller.js";
import { OrderController } from "../controllers/order.controller.js";
import { OtpController } from "../controllers/otp.controller.js";
import { ProductController } from "../controllers/product.controller.js";
import { StoreController } from "../controllers/store.controller.js";
import { UserController } from "../controllers/user.controller.js";
import { SessionCookie } from "../http/session-cookie.js";
import { AccessControl } from "../middlewares/access-control.middleware.js";
import type { RouteGuards } from "../middlewares/route-guards.js";
import { AuthRoutes } from "../routes/auth.routes.js";
import { CategoryRoutes } from "../routes/category.routes.js";
import { OrderRoutes } from "../routes/order.routes.js";
import { OtpRoutes } from "../routes/otp.routes.js";
import { ProductRoutes } from "../routes/product.routes.js";
import { StoreRoutes } from "../routes/store.routes.js";
import { UserRoutes } from "../routes/user.routes.js";
import { AdjustStockValidator } from "../validation/adjust-stock.validator.js";
import { CatalogQueryParser } from "../validation/catalog-query.parser.js";
import { CreateOrderValidator } from "../validation/create-order.validator.js";
import { CreateProductValidator } from "../validation/create-product.validator.js";
import { EnableOtpValidator } from "../validation/enable-otp.validator.js";
import { LoginValidator } from "../validation/login.validator.js";
import { RegisterValidator } from "../validation/register.validator.js";
import { UpdateOrderStatusValidator } from "../validation/update-order-status.validator.js";
import { UpdateProductValidator } from "../validation/update-product.validator.js";

export class Container {
  readonly guards: RouteGuards;
  readonly categoryRoutes: CategoryRoutes;
  readonly storeRoutes: StoreRoutes;
  readonly productRoutes: ProductRoutes;
  readonly userRoutes: UserRoutes;
  readonly authRoutes: AuthRoutes;
  readonly otpRoutes: OtpRoutes;
  readonly orderRoutes: OrderRoutes;

  constructor() {
    const passwordHasher = new BcryptPasswordHasher(12);
    const tokenService = new JwtTokenService(process.env.JWT_SECRET);
    const totpService = new OtplibTotpService();
    const backupCodeGenerator = new RandomBackupCodeGenerator();
    const qrCodeGenerator = new QrCodeGenerator(
      process.env.APP_NAME || "Nature Horse",
    );
    const trackingTokenGenerator = new RandomTrackingTokenGenerator();
    const clock = new SystemClock();
    const sessionCookie = new SessionCookie(
      process.env.NODE_ENV === "production",
    );

    const userRepository = new UserPrismaRepository(prisma);
    const twoFactorRepository = new TwoFactorPrismaRepository(prisma);
    const categoryRepository = new CategoryPrismaRepository(prisma);
    const storeRepository = new StorePrismaRepository(prisma);
    const productRepository = new ProductPrismaRepository(prisma);
    const orderRepository = new OrderPrismaRepository(prisma);

    this.guards = new AccessControl(tokenService);

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

    this.categoryRoutes = new CategoryRoutes(categoryController);
    this.storeRoutes = new StoreRoutes(storeController);
    this.productRoutes = new ProductRoutes(productController, this.guards);
    this.userRoutes = new UserRoutes(userController, this.guards);
    this.authRoutes = new AuthRoutes(authController, this.guards);
    this.otpRoutes = new OtpRoutes(otpController, this.guards);
    this.orderRoutes = new OrderRoutes(orderController, this.guards);
  }
}

export const container = new Container();
