import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/", requireAuth, requireRole("ADMIN"), userController.getAllUsers);

export default router;
