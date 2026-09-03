import { Router } from "express";
import { productController } from "../controllers/product.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/", productController.getAll);
router.get("/:id", productController.getById);
router.post("/", requireAuth, requireRole("ADMIN"), productController.create);
router.put("/:id", requireAuth, requireRole("ADMIN"), productController.update);
router.delete(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  productController.delete,
);

export default router;
