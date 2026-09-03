import { Router } from "express";
import { orderController } from "../controllers/order.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = Router();

router.post("/", requireAuth, orderController.create);
router.get("/me", requireAuth, orderController.getMine);
router.get("/", requireAuth, requireRole("ADMIN"), orderController.getAll);
router.get("/:id", requireAuth, orderController.getById);
router.patch(
  "/:id/status",
  requireAuth,
  requireRole("ADMIN"),
  orderController.updateStatus,
);
router.post("/:id/cancel", requireAuth, orderController.cancel);

export default router;
