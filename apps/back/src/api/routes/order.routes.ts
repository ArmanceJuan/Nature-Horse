import { Router } from "express";
import rateLimit from "express-rate-limit";
import type { OrderController } from "../controllers/order.controller.js";
import type { RouteGuards } from "../middlewares/route-guards.js";

export class OrderRoutes {
  readonly router: Router;

  constructor(controller: OrderController, guards: RouteGuards) {
    this.router = Router();

    const creationLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        message: "Too many orders from this address. Please try again later.",
      },
    });

    this.router.post(
      "/",
      creationLimiter,
      guards.optionalAuth,
      controller.create,
    );
    this.router.get("/me", guards.requireAuth, controller.getMine);
    this.router.get("/track/:trackingToken", controller.track);
    this.router.post(
      "/track/:trackingToken/cancel",
      controller.cancelByTrackingToken,
    );
    this.router.get(
      "/",
      guards.requireAuth,
      guards.requireRole("ADMIN"),
      controller.getAll,
    );
    this.router.get("/:id", guards.requireAuth, controller.getById);
    this.router.patch(
      "/:id/status",
      guards.requireAuth,
      guards.requireRole("ADMIN"),
      controller.updateStatus,
    );
    this.router.post("/:id/cancel", guards.requireAuth, controller.cancel);
  }
}
