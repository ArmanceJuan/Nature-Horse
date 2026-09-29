import type {
  CheckoutSession,
  CreateCheckoutSessionParams,
  IPaymentService,
  WebhookEvent,
} from "../../domain/interfaces/payment-service.interface.js";

export class FakePaymentService implements IPaymentService {
  shouldFail = false;
  private counter = 0;
  readonly createdSessions: CreateCheckoutSessionParams[] = [];

  async createCheckoutSession(
    params: CreateCheckoutSessionParams,
  ): Promise<CheckoutSession> {
    if (this.shouldFail) {
      throw new Error("Stripe is unreachable");
    }

    this.counter += 1;
    this.createdSessions.push(params);

    return {
      id: `session-${this.counter}`,
      url: `https://stripe.test/session-${this.counter}`,
    };
  }

  constructWebhookEvent(): WebhookEvent {
    return { type: "unhandled" };
  }
}
