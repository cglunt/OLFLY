import type { Request } from "express";

export function getRequestBase(req: Request): string | null {
  const proto = req.headers["x-forwarded-proto"] ?? "https";
  const host = req.headers["x-forwarded-host"] ?? req.headers.host;
  return host ? `${proto}://${host}` : null;
}

export function getSafeRequestUrl(req: Request): string | undefined {
  const rawUrl = req.originalUrl ?? req.url;
  const base = getRequestBase(req);
  if (!rawUrl) return undefined;
  if (!base) return rawUrl;
  try {
    return new URL(rawUrl, base).toString();
  } catch {
    return rawUrl;
  }
}
