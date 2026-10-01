import { Router } from "express";
import { validateGetRecipes, validatePostRecipe, validateGetRecipe, validatePatchRecipe, validateDeleteRecipe } from "./validates.js";
import { getRecipes, postRecipe, getRecipe, patchRecipe, deleteRecipe } from "./controllers.js";

export const recipesRouter = Router();

recipesRouter.get("/", validateGetRecipes, getRecipes);
recipesRouter.post("/", validatePostRecipe, postRecipe);
recipesRouter.get("/:id", validateGetRecipe, getRecipe);
recipesRouter.patch("/:id", validatePatchRecipe, patchRecipe);
recipesRouter.delete("/:id", validateDeleteRecipe, deleteRecipe);
