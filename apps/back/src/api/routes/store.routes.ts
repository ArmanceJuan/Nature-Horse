import { Router } from "express";
import type { StoreController } from "../controllers/store.controller.js";

export class StoreRoutes {
  readonly router: Router;

  constructor(controller: StoreController) {
    this.router = Router();
    this.router.get("/", controller.getAll);
    this.router.get("/:id", controller.getById);
  }
}
