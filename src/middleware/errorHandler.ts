import type { Request, Response, NextFunction } from "express";
import { AppError } from "@config/appError.js";

export function errorHandler(error: unknown, req: Request, res: Response, next: NextFunction): void {
    // log
    // console.error(error);

    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            error: {
                code: error.code,
                message: error.message
            }
        });
        return;
    }

    res.status(500).json({
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred"
        }
    });
}
