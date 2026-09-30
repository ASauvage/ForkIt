import type { User, UserReference } from "./user.js";

export interface Library {
    id: string;
    name: string;
    owner: User | UserReference;
    created_at: Date;
    updated_at: Date;
}

export type LibraryReference = Pick<Library, "id">;
export type IncludedLibraryFields = Array<"owner">;

export interface SelectLibraryInput {
    id?: Array<string>;
    name?: string;
    owner?: Array<string>;
    created_at_from?: Date;
    created_at_to?: Date;
    updated_at_from?: Date;
    updated_at_to?: Date;
    limit?: number;
}

export interface CreateLibraryInput {
    name: string;
}

export type UpdateLibraryInput = Partial<CreateLibraryInput>;
