import type { Request, Response } from "express";
import type { ConfirmOrderPaymentUseCase } from "../../application/usecases/confirm-order-payment.usecase.js";
import type { ExpireOrderPaymentUseCase } from "../../application/usecases/expire-order-payment.usecase.js";
import { ValidationError } from "../../domain/errors/http-errors.js";
import type { IPaymentService } from "../../domain/interfaces/payment-service.interface.js";
import { asyncHandler } from "../middlewares/async-handler.middleware.js";

export class PaymentWebhookController {
  private readonly paymentService: IPaymentService;
  private readonly confirmOrderPayment: ConfirmOrderPaymentUseCase;
  private readonly expireOrderPayment: ExpireOrderPaymentUseCase;

  constructor(
    paymentService: IPaymentService,
    confirmOrderPayment: ConfirmOrderPaymentUseCase,
    expireOrderPayment: ExpireOrderPaymentUseCase,
  ) {
    this.paymentService = paymentService;
    this.confirmOrderPayment = confirmOrderPayment;
    this.expireOrderPayment = expireOrderPayment;
  }

  handle = asyncHandler(async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"];

    if (typeof signature !== "string") {
      throw new ValidationError("Missing Stripe signature");
    }

    if (!Buffer.isBuffer(req.body)) {
      throw new ValidationError("Malformed webhook body");
    }

    const event = this.paymentService.constructWebhookEvent(
      req.body,
      signature,
    );

    if (event.type === "checkout.session.completed") {
      await this.confirmOrderPayment.execute(event.sessionId);
    } else if (event.type === "checkout.session.expired") {
      await this.expireOrderPayment.execute(event.sessionId);
    }

    res.status(200).json({ received: true });
  });
}
