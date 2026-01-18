import { Request, Response, NextFunction } from "express";
import admin from "./firebase-admin";

declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = authHeader.split("Bearer ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
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
