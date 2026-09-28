import { Router } from "express";
import type { AuthController } from "../controllers/auth.controller.js";
import type { RouteGuards } from "../middlewares/route-guards.js";

export class AuthRoutes {
  readonly router: Router;

  constructor(controller: AuthController, guards: RouteGuards) {
    this.router = Router();

    this.router.post("/register", controller.register);
    this.router.post("/login", controller.login);
    this.router.post("/logout", guards.requireAuth, controller.logout);
    this.router.get("/me", guards.requireAuth, controller.me);
  }
}
