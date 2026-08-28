import { Router } from "express";
import rateLimit from "express-rate-limit";
import { otpController } from "../controllers/otp.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

const otpLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 4,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again in 1 minute." },
});

router.use(requireAuth);

router.get("/generate-secret", otpController.generateSecret);
router.post("/enable", otpLimiter, otpController.enable);

export default router;
