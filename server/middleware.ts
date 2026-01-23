import { Request, Response, NextFunction } from "express";
import { getFirebaseAuth } from "./firebase-admin";
import { getRequestBase } from "./request-url";
import type { DecodedIdToken } from "firebase-admin/auth";


declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken;

    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  const debugAuth = process.env.DEBUG_AUTH === "true";
  const shouldLog = req.path.startsWith("/api/users");
  const proto = req.headers["x-forwarded-proto"] ?? "https";
  const host = req.headers["x-forwarded-host"] ?? req.headers.host;
  const base = getRequestBase(req);
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const expectedIss = projectId ? `https://securetoken.google.com/${projectId}` : undefined;
  const expectedAud = projectId;

  const logDiagnostics = (payload: Record<string, unknown>) => {
    if (shouldLog && debugAuth) {
      console.info("[auth] diagnostics", payload);
    }
  };

  if (shouldLog && debugAuth) {
    console.info(
      `[auth] request method=${req.method} originalUrl=${req.originalUrl} proto=${proto} host=${host} base=${base}`
    );
  }

  const decodeSegment = (segment?: string) => {
    if (!segment) return null;
    const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    try {
      return JSON.parse(Buffer.from(padded, "base64").toString("utf-8"));
    } catch {
      return null;
    }
  };

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    if (shouldLog && debugAuth) {
      console.warn("[auth] missing/invalid authorization header", {
        path: req.path,
        hasAuthHeader: !!authHeader,
        startsWithBearer: authHeader?.startsWith("Bearer ") ?? false,
      });
    }
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = authHeader.split("Bearer ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const [headerSegment, payloadSegment] = token.split(".");
    const decodedHeader = decodeSegment(headerSegment);
    const decodedPayload = decodeSegment(payloadSegment);

    logDiagnostics({
      hasAuthorizationHeader: true,
      startsWithBearer: authHeader.startsWith("Bearer "),
      tokenLength: token.length,
      expectedAud,
      expectedIss,
      headerKid: decodedHeader?.kid ?? null,
      payloadIss: decodedPayload?.iss ?? null,
      payloadAud: decodedPayload?.aud ?? null,
      payloadSub: decodedPayload?.sub ?? null,
      payloadExp: decodedPayload?.exp ?? null,
    });

    if (
      expectedAud &&
      expectedIss &&
      (decodedPayload?.aud !== expectedAud || decodedPayload?.iss !== expectedIss)
    ) {
      res.status(401).json({
        code: "TOKEN_PROJECT_MISMATCH",
        expectedAud,
        actualAud: decodedPayload?.aud ?? null,
        expectedIss,
        actualIss: decodedPayload?.iss ?? null,
      });
      return;
    }

    const decodedToken = await getFirebaseAuth().verifyIdToken(token);

    req.user = decodedToken;
    next();
  } catch (error) {
    if (shouldLog && debugAuth) {
      console.error("[auth] token verification failed", {
        path: req.path,
        message: error instanceof Error ? error.message : String(error),
      });
    }
    res.status(401).json({
      code: "VERIFY_FAILED",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

type GetResourceUserId = (req: Request) => string | undefined;

export function requireOwnership(getResourceUserId?: GetResourceUserId) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    let resourceUserId: string | undefined;

    if (getResourceUserId) {
      resourceUserId = getResourceUserId(req);
    } else {
      resourceUserId = req.params.userId || req.params.id;
    }

    if (!resourceUserId || req.user.uid !== resourceUserId) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    next();
  };
}
