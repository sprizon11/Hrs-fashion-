import { type Request, type Response, type NextFunction } from "express";
import crypto from "crypto";

const COOKIE_NAME = "hrs_admin";

function getSecret(): string {
  return process.env.SESSION_SECRET ?? "fallback-dev-secret";
}

function sign(value: string): string {
  const sig = crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");
  return `${value}.${sig}`;
}

function verify(signed: string): boolean {
  const dot = signed.lastIndexOf(".");
  if (dot < 0) return false;
  const value = signed.slice(0, dot);
  const expected = sign(value);
  try {
    return (
      expected.length === signed.length &&
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signed))
    );
  } catch {
    return false;
  }
}

export function setAdminCookie(res: Response): void {
  const token = sign("admin:authenticated");
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
  });
}

export function clearAdminCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME);
}

export function isAdminAuthenticated(req: Request): boolean {
  const token = (req.cookies as Record<string, string>)?.[COOKIE_NAME];
  if (!token) return false;
  return verify(token);
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!isAdminAuthenticated(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}
