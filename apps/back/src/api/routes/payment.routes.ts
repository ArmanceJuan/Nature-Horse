import { Router } from "express";
import type { PaymentWebhookController } from "../controllers/payment-webhook.controller.js";

export class PaymentRoutes {
  readonly webhookRouter: Router;

  constructor(controller: PaymentWebhookController) {
    this.webhookRouter = Router();
    this.webhookRouter.post("/", controller.handle);
  }
}
