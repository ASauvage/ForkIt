import type { Request, Response, NextFunction } from "express";
import { NotFoundError } from "@config/appError.js";
import type { Recipe, IncludedRecipeFields, SelectRecipeInput, CreateRecipeInput, UpdateRecipeInput } from "@app-types/recipe.js";
import * as recipesServices from "./services.js";

export async function getRecipes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const recipes: Array<Recipe> = await recipesServices.selectRecipes(
            res.locals.selectInput as SelectRecipeInput,
            res.locals.includedFields as IncludedRecipeFields
        );
        
        res.status(200).json({ recipes })
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export async function postRecipe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const recipe: Recipe = await recipesServices.insertRecipe(
            req.user!.id as string,
            res.locals.createInput as CreateRecipeInput
        );

        res.status(201).json({ recipe });
    } catch (error) {
        next(error);
    }
}

export async function getRecipe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const recipe: Recipe | null = await recipesServices.selectRecipeById(
            req.params.id as string,
            res.locals.includedFields as IncludedRecipeFields
        );

        res.status(recipe ? 200 : 404).json({ recipe });
    } catch (error) {
        next(error);
    }
}

export async function patchRecipe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const recipe: Recipe | null = await recipesServices.updateRecipe(
            req.params.id as string,
            res.locals.updateInput as UpdateRecipeInput
        );

        if (!recipe) {
            next(new NotFoundError());
        } else {
            res.status(200).json({ recipe });
        }
    } catch (error) {
        next(error);
    }
}

export async function deleteRecipe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const deleted: boolean = await recipesServices.deleteRecipe(req.params.id as string);

        if (!deleted) {
            next(new NotFoundError());
        } else {
            res.status(204).send();
        }
    } catch (error) {
        next(error);
    }
}
