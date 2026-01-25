import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { existsSync } from "node:fs";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.join(__dirname, "..", "dist", "index.cjs");
let app;
const shouldDebug =
  process.env.DEBUG_AUTH === "true" || process.env.DEBUG_SERVER === "true";

function getRequestBase(req) {
  const proto = req?.headers?.["x-forwarded-proto"] ?? "https";
  const host = req?.headers?.["x-forwarded-host"] ?? req?.headers?.host;
  return host ? `${proto}://${host}` : null;
}

function getSafeRequestUrl(req) {
  const rawUrl = req?.originalUrl ?? req?.url;
  const base = getRequestBase(req);
  if (!rawUrl) return undefined;
  if (!base) return rawUrl;
  try {
    return new URL(rawUrl, base).toString();
  } catch {
    return base && rawUrl ? (rawUrl.startsWith('/') ? base + rawUrl : base + '/' + rawUrl) : rawUrl;  }
}

function logServerError(err, req) {
  if (!shouldDebug) return;
  const base = getRequestBase(req);
  console.error("[server] unhandled error", {
    name: err?.name,
    message: err?.message,
    stack: err?.stack,
    method: req?.method,
    url: req?.url,
    originalUrl: req?.originalUrl,
    fullUrl: getSafeRequestUrl(req),
    base,
    host: req?.headers?.host,
    forwardedHost: req?.headers?.["x-forwarded-host"],
    forwardedProto: req?.headers?.["x-forwarded-proto"],
  });
}

if (existsSync(serverPath)) {
  const serverModule = require(serverPath);
  app = serverModule.default ?? serverModule;
}

export default async function handler(req, res) {
  // Add debug headers to identify handler and deployment
  res.setHeader('x-olfly-build-sha', process.env.VERCEL_GIT_COMMIT_SHA || 'local');
  res.setHeader('x-olfly-handler', 'api/index.js');
  res.setHeader('x-olfly-environment', process.env.NODE_ENV || 'unknown');

  if (!app) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({
      error: "Server build artifact missing",
      expected: "dist/index.cjs",
    }));
  }

  try {
    return await app(req, res);
  } catch (err) {
    logServerError(err, req);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({
      code: "SERVER_ERROR",
      message: err?.message ?? "Internal Server Error",
    }));
  }
}

