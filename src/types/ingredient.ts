export interface Ingredient {
    id: string;
    name: string;
    created_at: Date;
    updated_at: Date;
}

export type IngredientReference = Pick<Ingredient, "id">;

export interface SelectIngredientInput {
    id?: Array<string>;
    name?: string;
    created_at?: Date;
    updated_at?: Date;
    limit?: number;
}

export interface CreateIngredientInput {
    name: string;
}

export type UpdateIngredientInput = Partial<CreateIngredientInput>;
