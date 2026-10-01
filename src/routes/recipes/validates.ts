import type { Request, Response, NextFunction } from "express";
import { BadRequestError } from "@config/appError.js";
import type { IncludedRecipeFields, SelectRecipeInput, CreateRecipeInput, UpdateRecipeInput } from "@app-types/recipe.js";
import { isNonEmptyString, isPositiveNumber, isValidDate, isValidUuid, hasQueryParams, isEnumValue } from "@utils/validatesHelper.js";

export function validateGetRecipes(req: Request, res: Response, next: NextFunction): void {
    const {
        id,
        name,
        owner,
        library,
        prep_time_min,
        cook_time_min,
        servings,
        created_at_from,
        created_at_to,
        updated_at_from,
        updated_at_to,
        tag,
        ingredient,
        limit
    } = req.query;
    const input: SelectRecipeInput = {};
    const included: IncludedRecipeFields = [];
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
            input.name = name;
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

    if (library !== undefined) {
        if (!isValidUuid(library)) {
            errors.push('"library" must be a valid UUID when provided');
        } else {
            input.library = library;
        }
    }

    if (prep_time_min !== undefined) {
        if (!isPositiveNumber(prep_time_min)) {
            errors.push('"prep_time_min" must be a positive number when provided');
        } else {
            input.prep_time_min = Number(prep_time_min);
        }
    }

    if (cook_time_min !== undefined) {
        if (!isPositiveNumber(cook_time_min)) {
            errors.push('"cook_time_min" must be a positive number when provided');
        } else {
            input.cook_time_min = Number(cook_time_min);
        }
    }

    if (servings !== undefined) {
        if (!isPositiveNumber(servings)) {
            errors.push('"servings" must be a positive number when provided');
        } else {
            input.servings = Number(servings);
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

    if (tag !== undefined) {
        const tags = Array.isArray(tag) ? tag as Array<string> : [tag as string];

        if (!tags.every(isValidUuid)) {
            errors.push('"tag" must contain valid UUIDs when provided');
        } else {
            input.tag = tags;
        }
    }

    if (ingredient !== undefined) {
        const ingredients = Array.isArray(ingredient) ? ingredient as Array<string> : [ingredient as string];

        if (!ingredients.every(isValidUuid)) {
            errors.push('"ingredients" must contain valid UUIDs when provided');
        } else {
            input.ingredient = ingredients;
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
    res.locals.includedFields = included;
    next();
}

export function validatePostRecipe(req: Request, res: Response, next: NextFunction): void {
    const {
        name,
        library,
        description,
        image_url,
        prep_time_min,
        cook_time_min,
        servings,
        tags,
        ingredients,
        steps
    } = req.body;
    const input: CreateRecipeInput = { name: "", library: "", servings: 0, ingredients: [], steps: [] };
    const errors: Array<string> = [];

    if (!isNonEmptyString(name)) {
        errors.push('"name" is required and must be a non-empty string');
    } else {
        input.name = name;
    }

    if (!isValidUuid(library)) {
        errors.push('"library" is required and must be a valid UUID');
    } else {
        input.library = library;
    }

    if (description !== undefined) {
        if (!isNonEmptyString(description)) {
            errors.push('"description" must be a non-empty string when provided')
        } else {
            input.description = description;
        }
    }

    if (image_url !== undefined) {
        if (!isNonEmptyString(image_url)) {
            errors.push('"image_url" must be a non-empty string when provided')
        } else {
            input.image_url = image_url;
        }
    }

    if (prep_time_min !== undefined) {
        if (!isPositiveNumber(prep_time_min)) {
            errors.push('"prep_time_min" must be a positive number when provided')
        } else {
            input.prep_time_min = prep_time_min;
        }
    }

    if (cook_time_min !== undefined) {
        if (!isPositiveNumber(cook_time_min)) {
            errors.push('"cook_time_min" must be a positive number when provided')
        } else {
            input.cook_time_min = cook_time_min;
        }
    }

    if (servings !== undefined) {
        if (!isPositiveNumber(servings)) {
            errors.push('"servings" must be a positive number when provided')
        } else {
            input.servings = servings;
        }
    }

    if (tags !== undefined) {
        if (!tags.every(isValidUuid)) {
            errors.push('"tags" must contain valid UUIDs when provided');
        } else {
            input.tags = tags;
        }
    }

    if (!Array.isArray(ingredients) || !ingredients.every((ingredient) =>
        typeof ingredient === "object" &&
        ingredient !== null &&
        isValidUuid(ingredient.id) &&
        isPositiveNumber(ingredient.quantity) &&
        isNonEmptyString(ingredient.unit) || ingredient.unit === null &&
        isNonEmptyString(ingredient.notes) || ingredient.notes === null
    )) {
        errors.push('"ingredients" is required and must contain valid ingredients data');
    } else {
        input.ingredients = ingredients;
    }

    if (!steps.every(isNonEmptyString)) {
        errors.push('"steps" is required and must contain non-empty strings');
    } else {
        input.steps = steps;
    }

    if (errors.length > 0) {
        next(new BadRequestError(errors.join("\n")));
        return;
    }

    res.locals.createInput = input;
    next();
}

export function validateGetRecipe(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;
    const { include } = req.query;
    const included: IncludedRecipeFields = [];
    const errors: Array<string> = [];

    if (!isValidUuid(id)) {
        errors.push('Provided ID must be a valid UUID');
    }

    if (include !== undefined) {
        const includes = Array.isArray(include) ? include as Array<string> : [include as string];

        if (!includes.every((field) => isEnumValue(field, ["owner", "library", "tag", "ingredient"]))) {
            errors.push('"include" must contain valid fields');
        } else {
            included.push(...includes as IncludedRecipeFields);
        }
    }

    if (errors.length > 0) {
        next(new BadRequestError(errors.join("\n")));
        return;
    }

    res.locals.includedFields = included;
    next();
}

export function validatePatchRecipe(req: Request, res: Response, next: NextFunction): void {
    const {
        name,
        library,
        description,
        image_url,
        prep_time_min,
        cook_time_min,
        servings,
        tags,
        ingredients,
        steps
    } = req.body;
    const input: UpdateRecipeInput = {};
    const errors: Array<string> = [];

    if (Object.keys(req.body ?? {}).length === 0) {
        errors.push('Request body must contain at least one field to update.');
    }

    if (name !== undefined) {
        if (!isNonEmptyString(name)) {
            errors.push('"name" must be a non-empty string when provided');
        } else {
            input.name = name;
        }
    }

    if (library !== undefined) {
        if (!isValidUuid(library)) {
            errors.push('"library" must be a valid UUID when provided');
        } else {
            input.library = library;
        }
    }

    if (description !== undefined) {
        if (!isNonEmptyString(description)) {
            errors.push('"description" must be a non-empty string when provided');
        } else {
            input.description = description;
        }
    }

    if (image_url !== undefined) {
        if (!isNonEmptyString(image_url)) {
            errors.push('"image_url" must be a non-empty string when provided');
        } else {
            input.image_url = image_url;
        }
    }

    if (prep_time_min !== undefined) {
        if (!isPositiveNumber(prep_time_min)) {
            errors.push('"prep_time_min" must be a positive number when provided');
        } else {
            input.prep_time_min = prep_time_min;
        }
    }

    if (cook_time_min !== undefined) {
        if (!isPositiveNumber(cook_time_min)) {
            errors.push('"cook_time_min" must be a positive number when provided');
        } else {
            input.cook_time_min = cook_time_min;
        }
    }

    if (servings !== undefined) {
        if (!isPositiveNumber(servings)) {
            errors.push('"servings" must be a positive number when provided');
        } else {
            input.servings = servings;
        }
    }

    if (tags !== undefined) {
        if (!tags.every(isValidUuid)) {
            errors.push('"tags" must contain valid UUIDs when provided');
        } else {
            input.name = name;
        }
    }

    if (ingredients !== undefined) {
        if (!Array.isArray(ingredients) || !ingredients.every((ingredient) =>
            typeof ingredient === "object" &&
            ingredient !== null &&
            isValidUuid(ingredient.id) &&
            isPositiveNumber(ingredient.quantity) &&
            isNonEmptyString(ingredient.unit) || ingredient.unit === null &&
            isNonEmptyString(ingredient.notes) || ingredient.notes === null
        )) {
            errors.push('"ingredients" must contain valid ingredients data when provided');
        } else {
            input.ingredients = ingredients;
        }
    }

    if (steps !== undefined) {
        if (!steps.every(isNonEmptyString)) {
            errors.push('"steps" must contain non-empty strings when provided');
        } else {
            input.steps = steps;
        }
    }

    if (errors.length > 0) {
        next(new BadRequestError(errors.join("\n")));
        return;
    }

    res.locals.updateInput = input;
    next();
}

export function validateDeleteRecipe(req: Request, res: Response, next: NextFunction): void {
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
