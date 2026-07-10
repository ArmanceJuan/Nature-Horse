import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import userRoutes from "./routes/user.routes.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/api/health", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: "ok", message: "Nature Horse API is running" });
});

app.use("/api/users", userRoutes);

app.use(errorHandler);
