import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const ingredientsTable = pgTable("ingredients", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
});

export type DBIngredientInsert = typeof ingredientsTable.$inferInsert;
export type DBIngredientSelect = typeof ingredientsTable.$inferSelect;
