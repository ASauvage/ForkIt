import type { Request, Response, NextFunction } from "express";
import { NotFoundError } from "@config/appError.js";
import type { Ingredient, SelectIngredientInput, CreateIngredientInput, UpdateIngredientInput } from "@app-types/ingredient.js";
import * as ingredientsServices from "./services.js";

export async function getIngredients(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const ingredients: Array<Ingredient> = await ingredientsServices.selectIngredients(res.locals.selectInput as SelectIngredientInput);
        
        res.status(200).json({ ingredients })
    } catch (error) {
        next(error);
    }
}

export async function postIngredient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const ingredient: Ingredient = await ingredientsServices.insertIngredient(res.locals.createInput as CreateIngredientInput);

        res.status(201).json({ ingredient });
    } catch (error) {
        next(error);
    }
}

export async function getIngredient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const ingredient: Ingredient | null = await ingredientsServices.selectIngredientById(req.params.id as string);

        res.status(ingredient ? 200 : 404).json({ ingredient });
    } catch (error) {
        next(error);
    }
}

export async function patchIngredient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const ingredient: Ingredient | null = await ingredientsServices.updateIngredient(
            req.params.id as string,
            res.locals.updateInput as UpdateIngredientInput
        );

        if (!ingredient) {
            next(new NotFoundError());
        } else {
            res.status(200).json({ ingredient });
        }
    } catch (error) {
        next(error);
    }
}

export async function deleteIngredient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const deleted: boolean = await ingredientsServices.deleteIngredient(req.params.id as string);

        if (!deleted) {
            next(new NotFoundError());
        } else {
            res.status(204).send();
        }
    } catch (error) {
        next(error);
    }
}
