import { Router } from "express";
import { validateGetIngredients, validatePostIngredient, validateGetIngredient, validatePatchIngredient, validateDeleteIngredient } from "./validates.js";
import { getIngredients, postIngredient, getIngredient, patchIngredient, deleteIngredient } from "./controllers.js";

export const ingredientsRouter = Router();

ingredientsRouter.get("/", validateGetIngredients, getIngredients);
ingredientsRouter.post("/", validatePostIngredient, postIngredient);
ingredientsRouter.get("/:id", validateGetIngredient, getIngredient);
ingredientsRouter.patch("/:id", validatePatchIngredient, patchIngredient);
ingredientsRouter.delete("/:id", validateDeleteIngredient, deleteIngredient);
