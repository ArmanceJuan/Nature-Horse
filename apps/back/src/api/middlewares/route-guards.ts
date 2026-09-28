import type { RequestHandler } from "express";

export interface RouteGuards {
  requireAuth: RequestHandler;
  optionalAuth: RequestHandler;
  requireRole: (...allowedRoles: string[]) => RequestHandler;
}
