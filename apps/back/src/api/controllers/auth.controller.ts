import type { Request, Response } from "express";
import type { GetCurrentUserUseCase } from "../../application/usecases/get-current-user.usecase.js";
import type {
  LoginInput,
  LoginUserUseCase,
} from "../../application/usecases/login-user.usecase.js";
import type {
  RegisterInput,
  RegisterUserUseCase,
} from "../../application/usecases/register-user.usecase.js";
import { UnauthorizedError } from "../../domain/errors/http-errors.js";
import type { SessionCookie } from "../http/session-cookie.js";
import { asyncHandler } from "../middlewares/async-handler.middleware.js";
import type { IValidator } from "../validation/validator.js";

export interface AuthControllerDependencies {
  registerUser: RegisterUserUseCase;
  loginUser: LoginUserUseCase;
  getCurrentUser: GetCurrentUserUseCase;
  registerValidator: IValidator<RegisterInput>;
  loginValidator: IValidator<LoginInput>;
  sessionCookie: SessionCookie;
}

export class AuthController {
  private readonly dependencies: AuthControllerDependencies;

  constructor(dependencies: AuthControllerDependencies) {
    this.dependencies = dependencies;
  }

  register = asyncHandler(async (req: Request, res: Response) => {
    const input = this.dependencies.registerValidator.parse(req.body);
    const user = await this.dependencies.registerUser.execute(input);

    res.status(201).json(user);
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const input = this.dependencies.loginValidator.parse(req.body);
    const result = await this.dependencies.loginUser.execute(input);

    if (result.requiresOtp) {
      res.status(200).json({ requiresOtp: true });
      return;
    }

    this.dependencies.sessionCookie.set(res, result.token);
    res.status(200).json(result.user);
  });

  me = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const user = await this.dependencies.getCurrentUser.execute(
      req.user.userId,
    );

    res.set("Cache-Control", "no-store");
    res.status(200).json(user);
  });

  logout = asyncHandler(async (_req: Request, res: Response) => {
    this.dependencies.sessionCookie.clear(res);

    res.status(200).json({ message: "Logged out successfully" });
  });
}
