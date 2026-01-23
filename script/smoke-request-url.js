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

const scenarios = [
  {
    name: "originalUrl with query",
    req: {
      originalUrl: "/api/users?path=users",
      headers: {
        host: "olfly.app",
        "x-forwarded-proto": "https",
      },
    },
  },
  {
    name: "url fallback",
    req: {
      url: "/api/users?path=users",
      headers: {
        host: "olfly.app",
        "x-forwarded-proto": "https",
      },
    },
  },
];

for (const scenario of scenarios) {
  const url = getSafeRequestUrl(scenario.req);
  if (!url || !url.startsWith("https://olfly.app")) {
    throw new Error(`${scenario.name}: Unexpected URL: ${url}`);
  }
  console.log("OK", scenario.name, url);
}
