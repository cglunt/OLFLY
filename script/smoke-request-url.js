import { URL } from "node:url";

function getRequestBase(headers) {
  const proto = headers["x-forwarded-proto"] || "https";
  const host = headers["x-forwarded-host"] || headers.host;
  return host ? `${proto}://${host}` : null;
}

function getSafeRequestUrl(req) {
  const rawUrl = req.originalUrl || req.url;
  const base = getRequestBase(req.headers || {});
  if (!rawUrl) return undefined;
  if (!base) return rawUrl;
  try {
    return new URL(rawUrl, base).toString();
  } catch {
    return rawUrl;
  }
}

const mockReq = {
  originalUrl: "/api/users",
  headers: {
    host: "olfly.app",
    "x-forwarded-proto": "https",
  },
};

const url = getSafeRequestUrl(mockReq);
if (!url || !url.startsWith("https://olfly.app")) {
  throw new Error(`Unexpected URL: ${url}`);
}
console.log("OK", url);
