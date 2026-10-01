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
    created_at_from?: Date;
    created_at_to?: Date;
    updated_at_from?: Date;
    updated_at_to?: Date;
    limit?: number;
}

export interface CreateIngredientInput {
    name: string;
}

export type UpdateIngredientInput = Partial<CreateIngredientInput>;
