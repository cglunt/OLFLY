import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { existsSync } from "node:fs";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.join(__dirname, "..", "dist", "index.cjs");
let app;

if (existsSync(serverPath)) {
  const serverModule = require(serverPath);
  app = serverModule.default ?? serverModule;
}

export default function handler(req, res) {
  if (!app) {
    return res.status(500).json({
      error: "Server build artifact missing",
      expected: "dist/index.cjs",
    });
  }
  return app(req, res);
}
