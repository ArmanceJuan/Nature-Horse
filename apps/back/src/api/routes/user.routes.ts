import { Router } from "express";
import type { UserController } from "../controllers/user.controller.js";
import type { RouteGuards } from "../middlewares/route-guards.js";

export class UserRoutes {
  readonly router: Router;

  constructor(controller: UserController, guards: RouteGuards) {
    this.router = Router();

    this.router.get(
      "/",
      guards.requireAuth,
      guards.requireRole("ADMIN"),
      controller.getAll,
    );
  }
}
