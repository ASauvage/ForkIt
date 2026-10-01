import { db } from "@db/index.js";
import { ingredientsTable } from "@db/schemas/ingredients.js";
import { inArray, gte, lte, eq, asc, ilike, and, type SQL } from "drizzle-orm";
import type { Ingredient, SelectIngredientInput, CreateIngredientInput, UpdateIngredientInput } from "@app-types/ingredient.js";

export async function selectIngredients(input: SelectIngredientInput): Promise<Array<Ingredient>> {
    const conditions: Array<SQL<unknown>> = [];

    if (input.id !== undefined) conditions.push(inArray(ingredientsTable.id, input.id));
    if (input.name !== undefined) conditions.push(ilike(ingredientsTable.name, `%${input.name}%`));
    if (input.created_at_from !== undefined) conditions.push(gte(ingredientsTable.created_at, input.created_at_from));
    if (input.created_at_to !== undefined) conditions.push(lte(ingredientsTable.created_at, input.created_at_to));
    if (input.updated_at_from !== undefined) conditions.push(gte(ingredientsTable.updated_at, input.updated_at_from));
    if (input.updated_at_to !== undefined) conditions.push(lte(ingredientsTable.updated_at, input.updated_at_to));

    const results = await db.query.ingredientsTable.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        orderBy: [asc(ingredientsTable.name)],
        limit: input.limit ?? 100
    });

    return results.map((ingredient) => ({
        id: ingredient.id,
        name: ingredient.name,
        created_at: ingredient.created_at,
        updated_at: ingredient.updated_at,
    })) as Array<Ingredient>;
}

export async function insertIngredient(input: CreateIngredientInput): Promise<Ingredient> {
    const inserted = await db
        .insert(ingredientsTable)
        .values({
            name: input.name
        })
        .returning();

    return {
        id: inserted[0]!.id,
        name: inserted[0]!.name,
        created_at: inserted[0]!.created_at,
        updated_at: inserted[0]!.updated_at
    } as Ingredient;
}

export async function selectIngredientById(id: string): Promise<Ingredient | null> {
    const result = await db.query.ingredientsTable.findFirst({
        where: eq(ingredientsTable.id, id),
    });
    
    return result ? {
        id: result.id,
        name: result.name,
        created_at: result.created_at,
        updated_at: result.updated_at
    } as Ingredient : null;
}

export async function updateIngredient(id: string, input: UpdateIngredientInput): Promise<Ingredient | null> {
    const updatePayload: Record<string, unknown> = {};

    if (input.name !== undefined) updatePayload.name = input.name;

    updatePayload.updated_at = new Date()

    const updated = await db
        .update(ingredientsTable)
        .set(updatePayload)
        .where(eq(ingredientsTable.id, id))
        .returning();

    return updated[0] ? {
        id: updated[0]!.id,
        name: updated[0]!.name,
        created_at: updated[0]!.created_at,
        updated_at: updated[0]!.updated_at
    } as Ingredient : null;
}

export async function deleteIngredient(id: string): Promise<boolean> {
    const deleted = await db
        .delete(ingredientsTable)
        .where(eq(ingredientsTable.id, id))
        .returning();
    
    return deleted.length > 0;
}
