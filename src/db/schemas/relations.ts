import { relations } from "drizzle-orm";
import { pgTable, uuid, primaryKey, integer, text } from "drizzle-orm/pg-core";
import { ingredientsTable } from "./ingredients.js";
import { librariesTable } from "./libraries.js";
import { recipesTable } from "./recipes.js";
import { tagsTable } from "./tags.js";
import { usersTable } from "./users.js";

// ─────────────────────────────────────────────
// Junction tables
// ─────────────────────────────────────────────
export const recipesToTagsTable = pgTable("recipes_to_tags", {
    recipe_id: uuid("recipe_id").notNull().references(() => recipesTable.id, { onDelete: "cascade" }),
    tag_id: uuid("tag_id").notNull().references(() => tagsTable.id, { onDelete: "cascade" })
}, (t) => [primaryKey({ columns: [t.recipe_id, t.tag_id] })]);

export const recipesToIngredientsTable = pgTable("recipes_to_ingredients", {
    recipe_id: uuid("recipe_id").notNull().references(() => recipesTable.id, { onDelete: "cascade" }),
    ingredient_id: uuid("ingredient_id").notNull().references(() => ingredientsTable.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull(),
    unit: text("unit"),
    notes: text("notes")
}, (t) => [primaryKey({ columns: [t.recipe_id, t.ingredient_id] })]);

// ─────────────────────────────────────────────
// Relations
// ─────────────────────────────────────────────
export const ingredientsRelations = relations(ingredientsTable, ({ many }) => ({
    recipes: many(recipesToIngredientsTable)
}));

export const librariesRelations = relations(librariesTable, ({ one }) => ({
    owner: one(usersTable, {
        fields: [librariesTable.owner_id],
        references: [usersTable.id]
    })
}));

export const recipesRelations = relations(recipesTable, ({ one, many }) => ({
    owner: one(usersTable, {
        fields: [recipesTable.owner_id],
        references: [usersTable.id]
    }),
    library: one(librariesTable, {
        fields: [recipesTable.library_id],
        references: [librariesTable.id]
    }),
    tags: many(recipesToTagsTable),
    ingredients: many(recipesToIngredientsTable)
}));

export const recipesToIngredientsRelations = relations(recipesToIngredientsTable, ({ one }) => ({
    recipe: one(recipesTable, {
        fields: [recipesToIngredientsTable.recipe_id],
        references: [recipesTable.id]
    }),
    ingredient: one(ingredientsTable, {
        fields: [recipesToIngredientsTable.ingredient_id],
        references: [ingredientsTable.id]
    })
}));

export const recipesToTagsRelations = relations(recipesToTagsTable, ({ one }) => ({
    recipe: one(recipesTable, {
        fields: [recipesToTagsTable.recipe_id],
        references: [recipesTable.id],
    }),
    tag: one(tagsTable, {
        fields: [recipesToTagsTable.tag_id],
        references: [tagsTable.id],
    }),
}));

export const tagsRelations = relations(tagsTable, ({ many }) => ({
    recipes: many(recipesToTagsTable)
}));

export const usersRelations = relations(usersTable, ({ many }) => ({
    libraries: many(librariesTable),
    recipes: many(recipesTable)
}));
