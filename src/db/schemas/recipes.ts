import { pgTable, uuid, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { librariesTable } from "./libraries.js";
import { usersTable } from "./users.js";
import type { RecipeStep } from "@app-types/recipe.js";

export const recipesTable = pgTable('recipes', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull().unique(),
    owner_id: uuid('owner_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
    library_id: uuid('library_id').notNull().references(() => librariesTable.id, { onDelete: 'cascade' }),
    description: text('description'),
    image_url: text('image_url'),
    prep_time_min: integer('prep_time_min'),
    cook_time_min: integer('cook_time_min'),
    servings: integer('servings'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
    steps: jsonb('steps').$type<Array<RecipeStep>>().notNull()
});

export type DBRecipeInsert = typeof recipesTable.$inferInsert;
export type DBRecipeSelect = typeof recipesTable.$inferSelect;
