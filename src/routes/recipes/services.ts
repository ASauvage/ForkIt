import { db } from "@db/index.js";
import { recipesTable } from "@db/schemas/recipes.js";
import { recipesToTagsTable, recipesToIngredientsTable } from "@db/schemas/relations.js";
import { inArray, gte, lte, eq, asc, ilike, and, type SQL } from "drizzle-orm";
import type { Recipe, IncludedRecipeFields, SelectRecipeInput, CreateRecipeInput, UpdateRecipeInput } from "@app-types/recipe.js";

export async function selectRecipes(input: SelectRecipeInput, includedFields?: IncludedRecipeFields): Promise<Array<Recipe>> {
    const conditions: Array<SQL<unknown>> = [];

    if (input.id !== undefined) conditions.push(inArray(recipesTable.id, input.id));
    if (input.name !== undefined) conditions.push(ilike(recipesTable.name, `%${input.name}%`));
    if (input.owner !== undefined) conditions.push(inArray(recipesTable.owner_id, input.owner));
    if (input.library !== undefined) conditions.push(eq(recipesTable.library_id, input.library));
    if (input.prep_time_min !== undefined) conditions.push(eq(recipesTable.prep_time_min, input.prep_time_min));
    if (input.cook_time_min !== undefined) conditions.push(eq(recipesTable.cook_time_min, input.cook_time_min));
    if (input.servings !== undefined) conditions.push(eq(recipesTable.servings, input.servings));
    if (input.created_at_from !== undefined) conditions.push(gte(recipesTable.created_at, input.created_at_from));
    if (input.created_at_to !== undefined) conditions.push(lte(recipesTable.created_at, input.created_at_to));
    if (input.updated_at_from !== undefined) conditions.push(gte(recipesTable.updated_at, input.updated_at_from));
    if (input.updated_at_to !== undefined) conditions.push(lte(recipesTable.updated_at, input.updated_at_to));
    if (input.tag !== undefined) conditions.push();
    if (input.ingredient !== undefined) conditions.push();

    const results = await db.query.recipesTable.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        orderBy: [asc(recipesTable.name)],
        limit: input.limit ?? 100,
        with: {
            ...(includedFields?.includes("owner")
            ? { 
                owner: {
                    columns: { password_hash: false }
                }
            }: {}),
            ...(includedFields?.includes("library") ? { library: true}: {}),
            tags: {
                with: {
                    tag_id: true,
                    ...(includedFields?.includes("tag") ? { tag: true } : {})
                }
            },
            ingredients: {
                with: {
                    ingredient_id: true,
                    ...(includedFields?.includes("ingredient") ? { ingredient: true } : {}),
                    quantity: true,
                    unit: true,
                    notes: true
                }
            }
        }
    });

    return results.map((recipe) => ({
        id: recipe.id,
        name: recipe.name,
        owner: includedFields?.includes("owner") ? recipe.owner : { id: recipe.owner_id },
        library: includedFields?.includes("library") ? recipe.library : { id: recipe.library_id },
        description: recipe.description,
        image_url: recipe.image_url,
        prep_time_min: recipe.prep_time_min,
        cook_time_min: recipe.cook_time_min,
        servings: recipe.servings,
        created_at: recipe.created_at,
        updated_at: recipe.updated_at,
        tags: includedFields?.includes("tag") ? recipe.tags.map(({ tag }) => tag) : recipe.tags.map(({ tag_id }) => ({ id: tag_id })),
        ingredients: includedFields?.includes("ingredient")
            ? recipe.ingredients.map((({ ingredient_id, ingredient, ...rest }) => ({ ingredient, ...rest })))
            : recipe.ingredients.map((({ ingredient_id, ingredient, ...rest }) => ({ id: ingredient_id, ...rest }))),
        steps: recipe.steps
    })) as Array<Recipe>;
}

export async function insertRecipe(ownerId: string, input: CreateRecipeInput): Promise<Recipe> {
    const inserted = await db
        .insert(recipesTable)
        .values({
            name: input.name,
            owner_id: ownerId
        })
        .returning();

    return {
        id: inserted[0]!.id,
        name: inserted[0]!.name,
        owner: { id: inserted[0]!.owner_id },
        created_at: inserted[0]!.created_at,
        updated_at: inserted[0]!.updated_at
    } as Recipe;
}

export async function selectRecipeById(id: string, includedFields?: IncludedRecipeFields): Promise<Recipe | null> {
    const result = await db.query.recipesTable.findFirst({
        where: eq(recipesTable.id, id),
        with: {
            ...(includedFields?.includes("owner")
            ? { 
                owner: {
                    columns: { password_hash: false }
                }
            }: {}),
            ...(includedFields?.includes("library") ? { library: true}: {}),
            tags: {
                with: {
                    tag_id: true,
                    ...(includedFields?.includes("tag") ? { tag: true } : {})
                }
            },
            ingredients: {
                with: {
                    ingredient_id: true,
                    ...(includedFields?.includes("ingredient") ? { ingredient: true } : {}),
                    quantity: true,
                    unit: true,
                    notes: true
                }
            }
        }
    });
    
    return result ? {
        id: result.id,
        name: result.name,
        owner: includedFields?.includes("owner") ? result.owner : { id: result.owner_id },
        library: includedFields?.includes("library") ? result.library : { id: result.library_id },
        description: result.description,
        image_url: result.image_url,
        prep_time_min: result.prep_time_min,
        cook_time_min: result.cook_time_min,
        servings: result.servings,
        created_at: result.created_at,
        updated_at: result.updated_at,
        tags: includedFields?.includes("tag") ? result.tags.map(({ tag }) => tag) : result.tags.map(({ tag_id }) => ({ id: tag_id })),
        ingredients: includedFields?.includes("ingredient")
            ? result.ingredients.map((({ ingredient_id, ingredient, ...rest }) => ({ ingredient, ...rest })))
            : result.ingredients.map((({ ingredient_id, ingredient, ...rest }) => ({ id: ingredient_id, ...rest }))),
        steps: result.steps
    } as Recipe : null;
}

export async function updateRecipe(id: string, input: UpdateRecipeInput): Promise<Recipe | null> {
    return await db.transaction(async (tx) => {
        const existing = await tx.query.recipesTable.findFirst({
            where: eq(recipesTable.id, id)
        });

        if (!existing) {
            return null;
        }

        // Update recipe itself
        const updatePayload: Partial<DBRecipeSelect> = {};

        if (input.name !== undefined) updatePayload.name = input.name;
        if (input.library !== undefined) updatePayload.library_id = input.library;
        if (input.description !== undefined) updatePayload.description = input.description;
        if (input.image_url !== undefined) updatePayload.image_url = input.image_url;
        if (input.prep_time_min !== undefined) updatePayload.prep_time_min = input.prep_time_min;
        if (input.cook_time_min !== undefined) updatePayload.cook_time_min = input.cook_time_min;
        if (input.servings !== undefined) updatePayload.servings = input.servings;
        if (input.steps !== undefined) updatePayload.steps = input.steps;

        updatePayload.updated_at = new Date();

        const updated = await tx
            .update(recipesTable)
            .set(updatePayload)
            .where(eq(recipesTable.id, id))
            .returning();
        
        // Replace tags
        if (input.tags !== undefined) {
            await tx
                .delete(recipesToTagsTable)
                .where(eq(recipesToTagsTable.recipe_id, id));

            if (input.tags.length > 0) {
                await tx.insert(recipesToTagsTable).values(
                    input.tags.map((tag) => ({
                        recipe_id: id,
                        tag_id: tag
                    }))
                );
            }
        }

        // Replace ingredients
        if (input.ingredients !== undefined) {
            await tx
                .delete(recipesToIngredientsTable)
                .where(eq(recipesToIngredientsTable.recipe_id, id));

            if (input.ingredients.length > 0) {
                await tx.insert(recipesToIngredientsTable).values(
                    input.ingredients.map((ingredient) => ({
                        recipe_id: id,
                        ingredient_id: ingredient.ingredient,
                        quantity: ingredient.quantity,
                        unit: ingredient.unit,
                        notes: ingredient.notes
                    }))
                );
            }
        }

        // Fetch complete recipe
        return selectRecipeById(id);
    });
}

export async function deleteRecipe(id: string): Promise<boolean> {
    const deleted = await db
        .delete(recipesTable)
        .where(eq(recipesTable.id, id))
        .returning();
    
    return deleted.length > 0;
}
