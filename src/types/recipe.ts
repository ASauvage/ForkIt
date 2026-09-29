import type { Ingredient } from "./ingredient.js";
import type { Library } from "./library.js";
import type { Tag } from "./tag.js";
import type { User } from "./user.js";

export interface Recipe {
    id: string;
    name: string;
    owner: Partial<Omit<User, "id">>;
    library: Partial<Omit<Library, "id">>;
    description: string;
    image_url: string;
    prep_time_min: number;
    cook_time_min: number;
    servings: number;
    created_at: Date;
    updated_at: Date;
    tags: Array<Partial<Omit<Tag, "id">>>;
    ingredients: Array<RecipeIngredient>;
    steps: Array<RecipeStep>;
}

export interface RecipeIngredient {
    ingredient: Partial<Omit<Ingredient, "id">>;
    quantity: number;
    unit: string | null;
    notes: string | null;
}

export interface RecipeStep {
    index: number;
    text: string;
}
