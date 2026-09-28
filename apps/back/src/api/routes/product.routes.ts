import { Router } from "express";
import type { ProductController } from "../controllers/product.controller.js";
import type { RouteGuards } from "../middlewares/route-guards.js";

export class ProductRoutes {
  readonly router: Router;

  constructor(controller: ProductController, guards: RouteGuards) {
    this.router = Router();

    const adminOnly = [guards.requireAuth, guards.requireRole("ADMIN")];

    this.router.get("/", controller.getAll);
    this.router.get("/:id", controller.getById);
    this.router.post("/", ...adminOnly, controller.create);
    this.router.put("/:id", ...adminOnly, controller.update);
    this.router.delete("/:id", ...adminOnly, controller.delete);
    this.router.post("/:id/archive", ...adminOnly, controller.archive);
    this.router.post("/:id/reactivate", ...adminOnly, controller.reactivate);
    this.router.patch(
      "/variants/:variantId/stock",
      ...adminOnly,
      controller.adjustStock,
    );
  }
}
