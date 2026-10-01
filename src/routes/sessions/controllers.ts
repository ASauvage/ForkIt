import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import type { User, SessionLoginInput } from "@app-types/user.js"
import * as sessionsServices from "./services.js";
import { env } from "@config/env.js";
import { UnauthorizedError } from "@config/appError.js";

export async function postLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { mail, password } = res.locals.createInput as SessionLoginInput
        const user: User & { password_hash: string; } | null = await sessionsServices.selectUserByMail(mail);

        if (!user) {
            next(new UnauthorizedError("Invalid credentials"));
            return;
        }

        if (!await argon2.verify(user.password_hash, password)) {
            next(new UnauthorizedError("Invalid credentials"));
            return;
        }

        const token = jwt.sign(
            { sub: user.id, permissions: user.permissions },
            env.jwtSecret,
            { expiresIn: '1d' }
        );

        res.status(200).json({ token });
    } catch (error) {
        next(error);
    }
}

export async function getLogout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        // todo
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}
