import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import type { Container } from "./config/container.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";

export const createApp = (container: Container) => {
  const app = express();

  const globalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests. Please try again shortly." },
  });

  app.use(helmet());
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    }),
  );

  app.use(
    "/api/payments/webhook",
    express.raw({ type: "application/json" }),
    container.paymentRoutes.webhookRouter,
  );

  app.use(express.json());
  app.use(cookieParser());
  app.use(globalLimiter);

  app.get("/api/health", (_req: Request, res: Response) => {
    res
      .status(200)
      .json({ status: "ok", message: "Nature Horse API is running" });
  });

  app.use("/api/users", container.userRoutes.router);
  app.use("/api/auth", container.authRoutes.router);
  app.use("/api/otp", container.otpRoutes.router);
  app.use("/api/products", container.productRoutes.router);
  app.use("/api/orders", container.orderRoutes.router);
  app.use("/api/stores", container.storeRoutes.router);
  app.use("/api/categories", container.categoryRoutes.router);

  app.use(errorHandler);

  return app;
};
