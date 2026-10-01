import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "@app-types/jwtPayload.js"
import jwt from "jsonwebtoken";
import { env } from "@config/env.js";
import { UnauthorizedError } from "@config/appError.js";
import { isJwtPayload } from "@utils/validatesHelper.js";

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        next(new UnauthorizedError("Missing or malformed authentification token"));
        return;
    }

    const token = authHeader.slice("Bearer ".length).trim();

    if (!token) {
        next(new UnauthorizedError("Missing or malformed authentication token"));
        return;
    }

    try {
        const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;

        if (!isJwtPayload(payload)) {
            next(new UnauthorizedError("Invalid token"));
            return;
        }

        req.user = {
            id: payload.sub,
            permissions: payload.permissions
        };

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            next(new UnauthorizedError("Token expired"));
            return;
        }

        next(new UnauthorizedError("Invalid token"));
    }
}
