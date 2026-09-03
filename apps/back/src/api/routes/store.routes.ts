import { Router } from "express";
import { storeController } from "../controllers/store.controller.js";

const router = Router();

router.get("/", storeController.getAll);
router.get("/:id", storeController.getById);

export default router;
