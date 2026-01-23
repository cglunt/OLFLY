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

function logServerError(err, req) {
  if (!shouldDebug) return;
  console.error("[server] unhandled error", {
    name: err?.name,
    message: err?.message,
    stack: err?.stack,
    method: req?.method,
    url: req?.url,
    originalUrl: req?.originalUrl,
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
  if (!app) {
    return res.status(500).json({
      error: "Server build artifact missing",
      expected: "dist/index.cjs",
    });
  }
  try {
    return await app(req, res);
  } catch (err) {
    logServerError(err, req);
    return res.status(500).json({
      code: "SERVER_ERROR",
      message: err?.message ?? "Internal Server Error",
    });
  }
}
