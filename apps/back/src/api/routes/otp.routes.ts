import { Router } from "express";
import rateLimit from "express-rate-limit";
import type { OtpController } from "../controllers/otp.controller.js";
import type { RouteGuards } from "../middlewares/route-guards.js";

export class OtpRoutes {
  readonly router: Router;

  constructor(controller: OtpController, guards: RouteGuards) {
    this.router = Router();

    const buildLimiter = () =>
      rateLimit({
        windowMs: 60 * 1000,
        max: 4,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
          message: "Too many attempts. Please try again in 1 minute.",
        },
      });

    this.router.use(guards.requireAuth);
    this.router.get("/generate-secret", controller.generateSecret);
    this.router.post("/enable", buildLimiter(), controller.enable);
    this.router.post("/disable", buildLimiter(), controller.disable);
  }
}
