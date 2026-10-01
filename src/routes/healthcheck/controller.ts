import type { Request, Response, NextFunction } from "express";

export function getHealthcheck(req: Request, res: Response, next: NextFunction): void {
    res.status(200).json({ success: true });
}
