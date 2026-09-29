import { pgTable, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    mail: text('mail').notNull().unique(),
    password_hash: text('password_hash').notNull(),
    name: text('name').notNull().notNull(),
    image_url: text('image_url'),
    permissions: integer('permissions').notNull().default(2),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull()
});

export type DBUserInsert = typeof usersTable.$inferInsert;
export type DBUserSelect = typeof usersTable.$inferSelect;
