import type { Request, Response, NextFunction } from "express";
import { BadRequestError } from "@config/appError.js";
import type { SessionLoginInput } from "@app-types/user.js";
import { isNonEmptyString } from "@utils/validatesHelper.js";

export function validatePostLogin(req: Request, res: Response, next: NextFunction): void {
    const { mail, password } = req.body
    const input: SessionLoginInput = { mail: "", password: "" };
    const errors: Array<string> = [];

    if (!isNonEmptyString(mail)) {
        errors.push('"mail" is required and must be a non-empty string');
    } else {
        input.mail = mail;
    }

    if (!isNonEmptyString(password)) {
        errors.push('"password" is required and must be a non-empty string');
    } else {
        input.password = password;
    }
    
    if (errors.length > 0) {
        next(new BadRequestError(errors.join("\n")));
        return;
    }

    res.locals.createInput = input;
    next();
}
