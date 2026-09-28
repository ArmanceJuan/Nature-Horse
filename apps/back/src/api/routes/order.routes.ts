import { Router } from "express";
import { container } from "../config/container.js";
import { orderController } from "../controllers/order.controller.js";

const router = Router();
const { requireAuth, requireRole } = container.guards;

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
