import Stripe from "stripe";
import { ValidationError } from "../../domain/errors/http-errors.js";
import type {
  CheckoutSession,
  CreateCheckoutSessionParams,
  IPaymentService,
  WebhookEvent,
} from "../../domain/interfaces/payment-service.interface.js";

const SESSION_LIFETIME_IN_SECONDS = 31 * 60;

export class StripePaymentService implements IPaymentService {
  private readonly stripe: Stripe;
  private readonly webhookSecret: string;

  constructor(
    secretKey: string | undefined,
    webhookSecret: string | undefined,
  ) {
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY must be defined");
    }

    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET must be defined");
    }

    this.stripe = new Stripe(secretKey);
    this.webhookSecret = webhookSecret;
  }

  async createCheckoutSession(
    params: CreateCheckoutSessionParams,
  ): Promise<CheckoutSession> {
    const session = await this.stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: params.customerEmail,
      client_reference_id: params.orderId,
      line_items: params.lineItems.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "eur",
          unit_amount: item.unitAmount,
          product_data: { name: item.name },
        },
      })),
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      expires_at: Math.floor(Date.now() / 1000) + SESSION_LIFETIME_IN_SECONDS,
    });

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL");
    }

    return { id: session.id, url: session.url };
  }

  constructWebhookEvent(rawBody: Buffer, signature: string): WebhookEvent {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        this.webhookSecret,
      );
    } catch {
      throw new ValidationError("Invalid webhook signature");
    }

    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.expired"
    ) {
      const session = event.data.object as Stripe.Checkout.Session;
      return { type: event.type, sessionId: session.id };
    }

    return { type: "unhandled" };
  }
}
