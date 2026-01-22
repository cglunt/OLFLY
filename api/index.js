import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.join(__dirname, "..", "dist", "index.cjs");
const serverModule = require(serverPath);
const app = serverModule.default ?? serverModule;

export default function handler(req, res) {
  return app(req, res);
}
