import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const librariesTable = pgTable("libraries", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    owner_id: uuid("owner_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
});

export type DBLibraryInsert = typeof librariesTable.$inferInsert;
export type DBLibrarySelect = typeof librariesTable.$inferSelect;
