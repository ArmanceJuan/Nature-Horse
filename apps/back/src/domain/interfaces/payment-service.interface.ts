export interface CheckoutLineItem {
  name: string;
  unitAmount: number;
  quantity: number;
}

export interface CheckoutSession {
  id: string;
  url: string;
}

export interface CreateCheckoutSessionParams {
  orderId: string;
  customerEmail: string;
  lineItems: CheckoutLineItem[];
  successUrl: string;
  cancelUrl: string;
}

export type WebhookEvent =
  | { type: "checkout.session.completed"; sessionId: string }
  | { type: "checkout.session.expired"; sessionId: string }
  | { type: "unhandled" };

export interface IPaymentService {
  createCheckoutSession(
    params: CreateCheckoutSessionParams,
  ): Promise<CheckoutSession>;
  constructWebhookEvent(rawBody: Buffer, signature: string): WebhookEvent;
}
