import { db } from "@db/index.js";
import { tagsTable } from "@db/schemas/tags.js";
import { inArray, gte, lte, eq, asc, ilike, and, type SQL } from "drizzle-orm";
import type { Tag, SelectTagInput, CreateTagInput, UpdateTagInput } from "@app-types/tag.js";

export async function selectTags(input: SelectTagInput): Promise<Array<Tag>> {
    const conditions: Array<SQL<unknown>> = [];

    if (input.id !== undefined) {
        conditions.push(inArray(tagsTable.id, input.id));
    }

    if (input.name !== undefined) {
        conditions.push(ilike(tagsTable.name, `%${input.name}%`));
    }

    if (input.created_at_from !== undefined) {
        conditions.push(gte(tagsTable.created_at, input.created_at_from));
    }

    if (input.created_at_to !== undefined) {
        conditions.push(lte(tagsTable.created_at, input.created_at_to));
    }

    if (input.updated_at_from !== undefined) {
        conditions.push(gte(tagsTable.updated_at, input.updated_at_from));
    }

    if (input.updated_at_to !== undefined) {
        conditions.push(lte(tagsTable.updated_at, input.updated_at_to));
    }

    const results = await db.query.tagsTable.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        orderBy: [asc(tagsTable.name)],
        limit: input.limit ?? 100
    });

    return results.map((tag) => ({
        id: tag.id,
        name: tag.name,
        color: tag.color,
        created_at: tag.created_at,
        updated_at: tag.updated_at,
    })) as Array<Tag>;
}

export async function insertTag(input: CreateTagInput): Promise<Tag> {
    const inserted = await db
        .insert(tagsTable)
        .values({
            name: input.name,
            color: input.color
        })
        .returning();

    return {
        id: inserted[0]!.id,
        name: inserted[0]!.name,
        color: inserted[0]!.color,
        created_at: inserted[0]!.created_at,
        updated_at: inserted[0]!.updated_at
    } as Tag;
}

export async function selectTagById(id: string): Promise<Tag | null> {
    const result = await db.query.tagsTable.findFirst({
        where: eq(tagsTable.id, id),
    });
    
    return result ? {
        id: result.id,
        name: result.name,
        color: result.color,
        created_at: result.created_at,
        updated_at: result.updated_at
    } as Tag : null;
}

export async function updateTag(id: string, input: UpdateTagInput): Promise<Tag | null> {
    const updatePayload: Record<string, unknown> = {};

    if (input.name !== undefined) updatePayload.name = input.name;

    if (input.color !== undefined) updatePayload.color = input.color;

    updatePayload.updated_at = new Date()

    const updated = await db
        .update(tagsTable)
        .set(updatePayload)
        .where(eq(tagsTable.id, id))
        .returning();

    return updated[0] ? {
        id: updated[0]!.id,
        name: updated[0]!.name,
        color: updated[0]!.color,
        created_at: updated[0]!.created_at,
        updated_at: updated[0]!.updated_at
    } as Tag : null;
}

export async function deleteTag(id: string): Promise<boolean> {
    const deleted = await db
        .delete(tagsTable)
        .where(eq(tagsTable.id, id))
        .returning();
    
    return deleted.length > 0;
}
