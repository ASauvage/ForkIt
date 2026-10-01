import type { Request, Response, NextFunction } from "express";
import { BadRequestError } from "@config/appError.js";
import type { SelectTagInput, CreateTagInput, UpdateTagInput } from "@app-types/tag.js";
import { isNonEmptyString, isPositiveNumber, isValidDate, isValidUuid, hasQueryParams, isHexColor } from "@utils/validatesHelper.js";

export function validateGetTags(req: Request, res: Response, next: NextFunction): void {
    const {
        id,
        name,
        created_at_from,
        created_at_to,
        updated_at_from,
        updated_at_to,
        limit
    } = req.query;
    const input: SelectTagInput = {};
    const errors: Array<string> = [];

    if (id !== undefined) {
        const ids = Array.isArray(id) ? id as Array<string> : [id as string];

        if (hasQueryParams(req.query, ["id", "include"])) {
            errors.push('"id" cannot be combined with other filters');
        } else if (!ids.every(isValidUuid)) {
            errors.push('"id" must contain valid UUIDs when provided');
        } else {
            input.id = ids;
        }
    }

    if (name !== undefined) {
        if (!isNonEmptyString(name)) {
            errors.push('"name" must be a non-empty string when provided');
        } else {
            input.name = name as string;
        }
    }

    if (created_at_from !== undefined && !isValidDate(created_at_from)) {
        if (!isValidDate(created_at_from)) {
            errors.push('"created_at_from" must be a valid date when provided');
        } else {
            input.created_at_from = new Date(created_at_from as string);
        }
    }

    if (created_at_to !== undefined) {
        if (!isValidDate(created_at_to)) {
            errors.push('"created_at_to" must be a valid date when provided');
        } else {
            input.created_at_to = new Date(created_at_to as string);
        }
    }

    if (updated_at_from !== undefined) {
        if (!isValidDate(updated_at_from)) {
            errors.push('"updated_at_from" must be a valid date when provided');
        } else {
            input.updated_at_from = new Date(updated_at_from as string);
        }
    }

    if (updated_at_to !== undefined) {
        if (!isValidDate(updated_at_to)) {
            errors.push('"updated_at_to" must be a valid date when provided');
        } else {
            input.updated_at_to = new Date(updated_at_to as string);
        }
    }

    if (limit !== undefined) {
        if (!isPositiveNumber(limit)) {
            errors.push('"limit" must be a positive number when provided');
        } else {
            input.limit = Number(limit);
        }
    }

    if (errors.length > 0) {
        next(new BadRequestError(errors.join("\n")));
        return;
    }

    res.locals.selectInput = input;
    next();
}

export function validatePostTag(req: Request, res: Response, next: NextFunction): void {
    const { name, color } = req.body;
    const input: CreateTagInput = { name: "" };
    const errors: Array<string> = [];

    if (!isNonEmptyString(name)) {
        errors.push('"name" is required and must be a non-empty string');
    } else {
        input.name = name;
    }

    if (color !== undefined) {
        if(!isHexColor(name)) {
            errors.push('"color" must be a valid hex color when provided');
        } else {
            input.color = color;
        }
    }

    if (errors.length > 0) {
        next(new BadRequestError(errors.join("\n")));
        return;
    }

    res.locals.createInput = input;
    next();
}

export function validateGetTag(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;
    const errors: Array<string> = [];

    if (!isValidUuid(id)) {
        errors.push('Provided ID must be a valid UUID');
    }

    if (errors.length > 0) {
        next(new BadRequestError(errors.join("\n")));
        return;
    }

    next();
}

export function validatePatchTag(req: Request, res: Response, next: NextFunction): void {
    const { name, color } = req.body;
    const input: UpdateTagInput = {};
    const errors: Array<string> = [];

    if (Object.keys(req.body ?? {}).length === 0) {
        errors.push('Request body must contain at least one field to update.');
    }

    if (name !== undefined) {
        if (!isNonEmptyString(name)) {
            errors.push('"name" must be a non-empty string when provided')
        } else {
            input.name = name;
        }
    }

    if (color !== undefined) {
        if (!isHexColor(color)) {
            errors.push('"color" must be a valid hex color when provided')
        } else {
            input.name = name;
        }
    }

    if (errors.length > 0) {
        next(new BadRequestError(errors.join("\n")));
        return;
    }

    res.locals.updateInput = input;
    next();
}
