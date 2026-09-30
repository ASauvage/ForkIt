import type { Request, Response, NextFunction } from "express";
import { BadRequestError } from "@config/appError.js";
import type { IncludedLibraryFields, SelectLibraryInput, CreateLibraryInput, UpdateLibraryInput } from "@app-types/library.js";
import { isNonEmptyString, isPositiveNumber, isValidDate, isValidUuid, isEnumValue, hasQueryParams } from "@utils/validatesHelper.js";

export function validateGetLibraries(req: Request, res: Response, next: NextFunction): void {
    const {
        id,
        name,
        owner,
        created_at_from,
        created_at_to,
        updated_at_from,
        updated_at_to,
        limit,
        include
    } = req.query;
    const input: SelectLibraryInput = {};
    const included: IncludedLibraryFields = [];
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

    if (owner !== undefined) {
        const owners = Array.isArray(owner) ? owner as Array<string> : [owner as string];

        if (!owners.every(isValidUuid)) {
            errors.push('"owner" must contain valid UUIDs when provided');
        } else {
            input.owner = owners;
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

    if (include !== undefined) {
        const includes = Array.isArray(include) ? include as Array<string> : [include as string];

        if (!includes.every((field) => isEnumValue(field, ["owner"]))) {
            errors.push('"include" must contain valid fields');
        } else {
            included.push(...includes as IncludedLibraryFields);
        }
    }

    if (errors.length > 0) {
        next(new BadRequestError(errors.join("\n")));
        return;
    }

    res.locals.selectLibraryInput = input;
    res.locals.includedFields = included;
    next();
}

export function validatePostLibrary(req: Request, res: Response, next: NextFunction): void {
    const { name } = req.body;
    const input: CreateLibraryInput = { name: "" };
    const errors: Array<string> = [];

    if (!isNonEmptyString(name)) {
        errors.push('"name" is required and must be a non-empty string')
    } else {
        input.name = name;
    }

    if (errors.length > 0) {
        next(new BadRequestError(errors.join("\n")));
        return;
    }

    res.locals.createLibraryInput = input;
    next();
}

export function validateGetLibrary(req: Request, res: Response, next: NextFunction): void {
    const { include } = req.query;
    const included: IncludedLibraryFields = [];
    const errors: Array<string> = [];

    if (include !== undefined) {
        const includes = Array.isArray(include) ? include as Array<string> : [include as string];

        if (!includes.every((field) => isEnumValue(field, ["owner"]))) {
            errors.push('"include" must contain valid fields');
        } else {
            included.push(...includes as IncludedLibraryFields);
        }
    }

    if (errors.length > 0) {
        next(new BadRequestError(errors.join("\n")));
        return;
    }

    res.locals.includedFields = included;
    next();
}

export function validatePatchLibrary(req: Request, res: Response, next: NextFunction): void {
    const { name } = req.body;
    const input: UpdateLibraryInput = {};
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

    if (errors.length > 0) {
        next(new BadRequestError(errors.join("\n")));
        return;
    }

    res.locals.updateLibraryInput = input;
    next();
}
