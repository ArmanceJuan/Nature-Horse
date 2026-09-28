import type { Request, RequestHandler, Response } from "express";
import { AccessControl } from "./access-control.middleware.js";
import {
  ForbiddenError,
  UnauthorizedError,
} from "../../domain/errors/http-errors.js";
import { FakeTokenService } from "../../tests/fakes/fake-token.service.js";
import { SessionCookie } from "../http/session-cookie.js";

interface Outcome {
  called: boolean;
  error?: unknown;
}

const run = (handler: RequestHandler, request: Partial<Request>): Outcome => {
  const outcome: Outcome = { called: false };

  handler(request as Request, {} as Response, (error?: unknown) => {
    outcome.called = true;
    outcome.error = error;
  });

  return outcome;
};

const withCookie = (value: unknown): Partial<Request> => ({
  cookies: { [SessionCookie.NAME]: value },
});

describe("AccessControl", () => {
  const guards = new AccessControl(new FakeTokenService());

  describe("requireAuth", () => {
    it("lets a request with a valid token through and identifies the user", () => {
      const request = withCookie("token:user-1:ADMIN");

      const outcome = run(guards.requireAuth, request);

      expect(outcome.called).toBe(true);
      expect(outcome.error).toBeUndefined();
      expect(request.user).toEqual({ userId: "user-1", role: "ADMIN" });
    });

    it("refuses a request without cookie", () => {
      const request: Partial<Request> = { cookies: {} };

      const outcome = run(guards.requireAuth, request);

      expect(outcome.error).toBeInstanceOf(UnauthorizedError);
      expect(request.user).toBeUndefined();
    });

    it("refuses a request without any cookie at all", () => {
      expect(run(guards.requireAuth, {}).error).toBeInstanceOf(
        UnauthorizedError,
      );
    });

    it("refuses an empty or unexpected cookie value", () => {
      expect(run(guards.requireAuth, withCookie("")).error).toBeInstanceOf(
        UnauthorizedError,
      );
      expect(
        run(guards.requireAuth, withCookie(["a", "b"])).error,
      ).toBeInstanceOf(UnauthorizedError);
    });

    it("refuses an invalid token", () => {
      const request = withCookie("garbage");

      const outcome = run(guards.requireAuth, request);

      expect(outcome.error).toBeInstanceOf(UnauthorizedError);
      expect(request.user).toBeUndefined();
    });
  });

  describe("optionalAuth", () => {
    it("lets an anonymous request through without identifying anyone", () => {
      const request: Partial<Request> = { cookies: {} };

      const outcome = run(guards.optionalAuth, request);

      expect(outcome.called).toBe(true);
      expect(outcome.error).toBeUndefined();
      expect(request.user).toBeUndefined();
    });

    it("identifies the user when the token is valid", () => {
      const request = withCookie("token:user-2:CLIENT");

      run(guards.optionalAuth, request);

      expect(request.user).toEqual({ userId: "user-2", role: "CLIENT" });
    });

    it("rejects an invalid token instead of silently treating the request as anonymous", () => {
      const outcome = run(guards.optionalAuth, withCookie("garbage"));

      expect(outcome.error).toBeInstanceOf(UnauthorizedError);
    });
  });

  describe("requireRole", () => {
    it("refuses a request that is not identified", () => {
      expect(run(guards.requireRole("ADMIN"), {}).error).toBeInstanceOf(
        UnauthorizedError,
      );
    });

    it("refuses a user whose role is not allowed", () => {
      const outcome = run(guards.requireRole("ADMIN"), {
        user: { userId: "u", role: "CLIENT" },
      });

      expect(outcome.error).toBeInstanceOf(ForbiddenError);
    });

    it("lets a user with an allowed role through", () => {
      const outcome = run(guards.requireRole("ADMIN"), {
        user: { userId: "u", role: "ADMIN" },
      });

      expect(outcome.called).toBe(true);
      expect(outcome.error).toBeUndefined();
    });

    it("accepts any of several roles", () => {
      const handler = guards.requireRole("ADMIN", "STAFF");

      expect(
        run(handler, { user: { userId: "u", role: "STAFF" } }).error,
      ).toBeUndefined();
      expect(
        run(handler, { user: { userId: "u", role: "CLIENT" } }).error,
      ).toBeInstanceOf(ForbiddenError);
    });
  });
});
