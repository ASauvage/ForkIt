import type { SelectIngredientInput, CreateIngredientInput, UpdateIngredientInput } from "./ingredient.ts";
import type { IncludedLibraryFields, SelectLibraryInput, CreateLibraryInput, UpdateLibraryInput } from "./library.ts";
import type { IncludedRecipeFields, SelectRecipeInput, CreateRecipeInput, UpdateRecipeInput } from "./recipe.ts";
import type { SelectTagInput, CreateTagInput, UpdateTagInput } from "./tag.ts";
import type { SelectUserInput, CreateUserInput, UpdateUserInput, SessionLoginInput } from "./user.js";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                permissions: number;
            };
        }

        interface Locals {
            includedFields?: IncludedLibraryFields | IncludedRecipeFields

            selectInput?: SelectIngredientInput | SelectLibraryInput | SelectRecipeInput | SelectTagInput;
            createInput?: CreateIngredientInput | CreateLibraryInput | CreateRecipeInput | CreateTagInput | SessionLoginInput;
            updateInput?: UpdateIngredientInput | UpdateLibraryInput | UpdateRecipeInput | UpdateTagInput;
        }
    }
}