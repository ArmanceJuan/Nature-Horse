import { Router } from "express";
import type { CategoryController } from "../controllers/category.controller.js";

export class CategoryRoutes {
  readonly router: Router;

  constructor(controller: CategoryController) {
    this.router = Router();
    this.router.get("/", controller.getAll);
  }
}
