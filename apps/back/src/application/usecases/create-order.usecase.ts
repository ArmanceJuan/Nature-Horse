import { ORDER_LIMITS } from "../../domain/entities/create-order-input.entity.js";
import type {
  CreateOrderInput,
  CreateOrderItemInput,
} from "../../domain/entities/create-order-input.entity.js";
import type { Order } from "../../domain/entities/order.entity.js";
import {
  AppError,
  ConflictError,
  NotFoundError,
  PaymentError,
  UnauthorizedError,
  ValidationError,
} from "../../domain/errors/http-errors.js";
import type { IClock } from "../../domain/interfaces/clock.interface.js";
import type {
  IOrderRepository,
  NewOrderItemData,
} from "../../domain/interfaces/order-repository.interface.js";
import type { IPaymentService } from "../../domain/interfaces/payment-service.interface.js";
import type { IProductRepository } from "../../domain/interfaces/product-repository.interface.js";
import type { IStoreRepository } from "../../domain/interfaces/store-repository.interface.js";
import type { ITrackingTokenGenerator } from "../../domain/interfaces/tracking-token-generator.interface.js";
import type { IUserRepository } from "../../domain/interfaces/user-repository.interface.js";
import { Email } from "../../domain/value-objects/email.js";
import type { TrackingToken } from "../../domain/value-objects/tracking-token.js";

export interface CreatedOrder {
  order: Order;
  trackingToken: TrackingToken;
  checkoutUrl: string;
}

interface Customer {
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
}

export class CreateOrderUseCase {
  static readonly PICKUP_DELAY_IN_MS = 60 * 60 * 1000;

  private readonly orderRepository: IOrderRepository;
  private readonly productRepository: IProductRepository;
  private readonly storeRepository: IStoreRepository;
  private readonly userRepository: IUserRepository;
  private readonly trackingTokenGenerator: ITrackingTokenGenerator;
  private readonly clock: IClock;
  private readonly paymentService: IPaymentService;
  private readonly frontendBaseUrl: string;

  constructor(
    orderRepository: IOrderRepository,
    productRepository: IProductRepository,
    storeRepository: IStoreRepository,
    userRepository: IUserRepository,
    trackingTokenGenerator: ITrackingTokenGenerator,
    clock: IClock,
    paymentService: IPaymentService,
    frontendBaseUrl: string,
  ) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
    this.storeRepository = storeRepository;
    this.userRepository = userRepository;
    this.trackingTokenGenerator = trackingTokenGenerator;
    this.clock = clock;
    this.paymentService = paymentService;
    this.frontendBaseUrl = frontendBaseUrl;
  }

  async execute(input: CreateOrderInput): Promise<CreatedOrder> {
    if (input.items.length === 0) {
      throw new ValidationError("Order must contain at least one item");
    }

    const customer = await this.resolveCustomer(input);
    await this.ensureStoreExists(input.storeId);

    const lines = this.mergeLines(input.items);
    const { items, totalPrice } = await this.priceLines(lines);

    const trackingToken = this.trackingTokenGenerator.generate();

    const order = await this.orderRepository.create({
      userId: input.userId,
      storeId: input.storeId,
      customerEmail: customer.email,
      customerFirstName: customer.firstName,
      customerLastName: customer.lastName,
      customerPhone: customer.phone,
      trackingToken,
      pickupReadyAt: new Date(
        this.clock.now().getTime() + CreateOrderUseCase.PICKUP_DELAY_IN_MS,
      ),
      totalPrice,
      items,
    });

    try {
      const session = await this.paymentService.createCheckoutSession({
        orderId: order.id,
        customerEmail: customer.email,
        lineItems: items.map((item) => ({
          name: item.productName,
          unitAmount: Math.round(item.unitPrice * 100),
          quantity: item.quantity,
        })),
        successUrl: `${this.frontendBaseUrl}/order/confirmation?token=${trackingToken.value}`,
        cancelUrl: `${this.frontendBaseUrl}/order/cancelled?token=${trackingToken.value}`,
      });

      await this.orderRepository.attachPaymentSession(order.id, session.id);

      return { order, trackingToken, checkoutUrl: session.url };
    } catch (error) {
      await this.orderRepository.expire(order.id).catch(() => undefined);

      throw error instanceof AppError
        ? error
        : new PaymentError("Unable to start the payment");
    }
  }

  private async resolveCustomer(input: CreateOrderInput): Promise<Customer> {
    if (input.userId) {
      const user = await this.userRepository.findById(input.userId);

      if (!user) {
        throw new UnauthorizedError();
      }

      return {
        email: user.email.trim().toLowerCase(),
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      };
    }

    if (!input.guest) {
      throw new ValidationError(
        "Customer details are required to order without an account",
      );
    }

    return {
      email: Email.of(input.guest.email).value,
      firstName: input.guest.firstName.trim(),
      lastName: input.guest.lastName.trim(),
      phone: input.guest.phone?.trim() || null,
    };
  }

  private async ensureStoreExists(storeId: string): Promise<void> {
    if (!(await this.storeRepository.findById(storeId))) {
      throw new NotFoundError("Store not found");
    }
  }

  private mergeLines(items: CreateOrderItemInput[]): CreateOrderItemInput[] {
    const quantities = new Map<string, number>();

    for (const item of items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new ValidationError("Item quantity must be a positive integer");
      }

      quantities.set(
        item.productVariantId,
        (quantities.get(item.productVariantId) ?? 0) + item.quantity,
      );
    }

    return [...quantities.entries()].map(([productVariantId, quantity]) => {
      if (quantity > ORDER_LIMITS.MAX_UNITS_PER_LINE) {
        throw new ValidationError(
          `An order line cannot exceed ${ORDER_LIMITS.MAX_UNITS_PER_LINE} units`,
        );
      }

      return { productVariantId, quantity };
    });
  }

  private async priceLines(
    lines: CreateOrderItemInput[],
  ): Promise<{ items: NewOrderItemData[]; totalPrice: number }> {
    const items: NewOrderItemData[] = [];
    let totalInCents = 0;

    for (const line of lines) {
      const product = await this.productRepository.findByVariantId(
        line.productVariantId,
      );

      if (!product) {
        throw new NotFoundError(
          `Product variant ${line.productVariantId} not found`,
        );
      }

      if (!product.isActive()) {
        throw new ConflictError(
          `Product "${product.name}" is no longer available`,
        );
      }

      totalInCents += Math.round(product.price * 100) * line.quantity;

      items.push({
        productVariantId: line.productVariantId,
        productName: product.name,
        quantity: line.quantity,
        unitPrice: product.price,
      });
    }

    return { items, totalPrice: totalInCents / 100 };
  }
}
