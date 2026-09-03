import { Router } from "express";
import { productController } from "../controllers/product.controller.js";

const router = Router();

router.get("/", productController.getAll);
router.get("/:id", productController.getById);

export default router;
