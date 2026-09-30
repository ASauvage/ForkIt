import type { Ingredient, IngredientReference } from "./ingredient.js";
import type { Library, LibraryReference } from "./library.js";
import type { Tag, TagReference } from "./tag.js";
import type { User, UserReference } from "./user.js";

export interface Recipe {
    id: string;
    name: string;
    owner: User | UserReference;
    library: Library | LibraryReference;
    description: string;
    image_url: string;
    prep_time_min: number;
    cook_time_min: number;
    servings: number;
    created_at: Date;
    updated_at: Date;
    tags: Array<Tag> | Array<TagReference>;
    ingredients: Array<RecipeIngredient>;
    steps: Array<RecipeStep>;
}

export interface RecipeIngredient {
    ingredient: Ingredient | IngredientReference;
    quantity: number;
    unit: string | null;
    notes: string | null;
}

export interface RecipeStep {
    index: number;
    text: string;
}

export type RecipeReference = Pick<Recipe, "id">;

export interface CreateRecipeInput {
    name: string;
    library: string;
    description?: string;
    image_url?: string;
    prep_time_min?: number;
    cook_time_min?: number;
    servings: number;
    tags: Array<string>;
    ingredients: Array<RecipeIngredient>;
    steps: Array<string>;
}

export type UpdateRecipeInput = Partial<CreateRecipeInput>;
