import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const tagsTable = pgTable("tags", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    color: text("color"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
});

export type DBTagInsert = typeof tagsTable.$inferInsert;
export type DBTagSelect = typeof tagsTable.$inferSelect;
