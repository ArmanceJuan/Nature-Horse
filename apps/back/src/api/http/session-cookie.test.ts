import type { Response } from "express";
import { SessionCookie } from "./session-cookie.js";

class RecordingResponse {
  cookies: { name: string; value: string; options: Record<string, unknown> }[] =
    [];
  cleared: { name: string; options: Record<string, unknown> }[] = [];

  cookie(name: string, value: string, options: Record<string, unknown>): this {
    this.cookies.push({ name, value, options });
    return this;
  }

  clearCookie(name: string, options: Record<string, unknown>): this {
    this.cleared.push({ name, options });
    return this;
  }
}

describe("SessionCookie", () => {
  it("sets the session token in a cookie that scripts cannot read", () => {
    const recorder = new RecordingResponse();

    new SessionCookie(false).set(recorder as unknown as Response, "the-token");

    expect(recorder.cookies).toHaveLength(1);
    expect(recorder.cookies[0].name).toBe("access_token");
    expect(recorder.cookies[0].value).toBe("the-token");
    expect(recorder.cookies[0].options.httpOnly).toBe(true);
    expect(recorder.cookies[0].options.sameSite).toBe("strict");
  });

  it("keeps the cookie for seven days", () => {
    const recorder = new RecordingResponse();

    new SessionCookie(false).set(recorder as unknown as Response, "the-token");

    expect(recorder.cookies[0].options.maxAge).toBe(7 * 24 * 60 * 60 * 1000);
  });

  it("only sends the cookie over HTTPS when it is told to", () => {
    const secure = new RecordingResponse();
    const insecure = new RecordingResponse();

    new SessionCookie(true).set(secure as unknown as Response, "t");
    new SessionCookie(false).set(insecure as unknown as Response, "t");

    expect(secure.cookies[0].options.secure).toBe(true);
    expect(insecure.cookies[0].options.secure).toBe(false);
  });

  it("clears the cookie with the same flags it was set with", () => {
    const recorder = new RecordingResponse();

    new SessionCookie(true).clear(recorder as unknown as Response);

    expect(recorder.cleared[0].name).toBe("access_token");
    expect(recorder.cleared[0].options).toEqual({
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
  });
});
