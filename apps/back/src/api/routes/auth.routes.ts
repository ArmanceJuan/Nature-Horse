import { Router } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import type { Request } from "express";
import type { AuthController } from "../controllers/auth.controller.js";
import type { RouteGuards } from "../middlewares/route-guards.js";

export class AuthRoutes {
  readonly router: Router;

  constructor(controller: AuthController, guards: RouteGuards) {
    this.router = Router();

    const loginLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10,
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req: Request) => {
        const email =
          typeof req.body?.email === "string"
            ? req.body.email.trim().toLowerCase()
            : "unknown";
        return `${ipKeyGenerator(req.ip ?? "")}:${email}`;
      },
      message: { message: "Too many login attempts. Please try again later." },
    });

    this.router.post("/register", controller.register);
    this.router.post("/login", loginLimiter, controller.login);
    this.router.post("/logout", guards.requireAuth, controller.logout);
    this.router.get("/me", guards.requireAuth, controller.me);
  }
}
