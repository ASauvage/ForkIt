import { db } from "@db/index.js";
import { librariesTable } from "@db/schemas/libraries.js";
import { inArray, gte, lte, eq, asc, ilike, and, type SQL } from "drizzle-orm";
import type { Library, IncludedLibraryFields, SelectLibraryInput, CreateLibraryInput, UpdateLibraryInput } from "@app-types/library.js";

export async function selectLibraries(input: SelectLibraryInput, includedFields?: IncludedLibraryFields): Promise<Array<Library>> {
    const conditions: Array<SQL<unknown>> = [];

    if (input.id !== undefined) {
        conditions.push(inArray(librariesTable.id, input.id));
    }

    if (input.name !== undefined) {
        conditions.push(ilike(librariesTable.name, `%${input.name}%`));
    }

    if (input.owner !== undefined) {
        conditions.push(inArray(librariesTable.owner_id, input.owner));
    }

    if (input.created_at_from !== undefined) {
        conditions.push(gte(librariesTable.created_at, input.created_at_from));
    }

    if (input.created_at_to !== undefined) {
        conditions.push(lte(librariesTable.created_at, input.created_at_to));
    }

    if (input.updated_at_from !== undefined) {
        conditions.push(gte(librariesTable.updated_at, input.updated_at_from));
    }

    if (input.updated_at_to !== undefined) {
        conditions.push(lte(librariesTable.updated_at, input.updated_at_to));
    }


    const results = await db.query.librariesTable.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        orderBy: [asc(librariesTable.name)],
        limit: input.limit ?? 100,
        with: {
            ...(includedFields?.includes("owner")
            ? { 
                owner: {
                    columns: { password_hash: false }
                }
            }: {})
        }
    });

    return results.map((library) => ({
        id: library.id,
        name: library.name,
        owner: includedFields?.includes("owner")
            ? library.owner : {
                id: library.owner_id,
            },
        created_at: library.created_at,
        updated_at: library.updated_at,
    })) as Array<Library>;
}

export async function insertLibrary(ownerId: string, input: CreateLibraryInput): Promise<Library> {
    const inserted = await db
        .insert(librariesTable)
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
    } as Library;
}

export async function selectLibraryById(id: string, includedFields?: IncludedLibraryFields): Promise<Library | null> {
    const result = await db.query.librariesTable.findFirst({
        where: eq(librariesTable.id, id),
        with: {
            ...(includedFields?.includes("owner")
            ? { 
                owner: {
                    columns: { password_hash: false }
                }
            }: {})
        }
    });
    
    return result ? {
        id: result.id,
        name: result.name,
        owner: includedFields?.includes("owner")
            ? result.owner : {
                id: result.owner_id,
            },
        created_at: result.created_at,
        updated_at: result.updated_at
    } as Library : null;
}

export async function updateLibrary(id: string, input: UpdateLibraryInput): Promise<Library | null> {
    const updatePayload: Record<string, unknown> = {};

    if (input.name !== undefined) updatePayload.name = input.name;

    const updated = await db
        .update(librariesTable)
        .set(updatePayload)
        .where(eq(librariesTable.id, id))
        .returning();

    return updated[0] ? {
        id: updated[0]!.id,
        name: updated[0]!.name,
        owner: { id: updated[0]!.owner_id },
        created_at: updated[0]!.created_at,
        updated_at: updated[0]!.updated_at
    } as Library : null;
}

export async function deleteLibrary(id: string): Promise<boolean> {
    const deleted = await db
        .delete(librariesTable)
        .where(eq(librariesTable.id, id))
        .returning();
    
    return deleted.length > 0;
}
