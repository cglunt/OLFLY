import { Request, Response, NextFunction } from "express";
import { getFirebaseAuth } from "./firebase-admin";
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
  const shouldLog = req.path.startsWith("/api/users");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    if (shouldLog) {
      console.warn("[auth] missing/invalid authorization header", {
        path: req.path,
        hasAuthHeader: !!authHeader,
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
    const decodedToken = await getFirebaseAuth().verifyIdToken(token);

    req.user = decodedToken;
    next();
  } catch (error) {
    if (shouldLog) {
      console.error("[auth] token verification failed", {
        path: req.path,
        message: error instanceof Error ? error.message : String(error),
      });
    }
    res.status(401).json({ message: "Unauthorized" });
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
