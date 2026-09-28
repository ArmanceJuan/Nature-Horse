import type { Response } from "express";

export class SessionCookie {
  static readonly NAME = "access_token";
  private static readonly MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

  private readonly secure: boolean;

  constructor(secure: boolean) {
    this.secure = secure;
  }

  set(res: Response, token: string): void {
    res.cookie(SessionCookie.NAME, token, {
      httpOnly: true,
      secure: this.secure,
      sameSite: "strict",
      maxAge: SessionCookie.MAX_AGE_MS,
    });
  }

  clear(res: Response): void {
    res.clearCookie(SessionCookie.NAME, {
      httpOnly: true,
      secure: this.secure,
      sameSite: "strict",
    });
  }
}
