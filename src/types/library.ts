import type { User, UserReference } from "./user.js";

export interface Library {
    id: string;
    name: string;
    owner: User | UserReference;
    created_at: Date;
    updated_at: Date;
}

export type LibraryReference = Pick<Library, "id">;

export interface CreateLibraryInput {
    name: string;
}

export type UpdateLibraryInput = Partial<CreateLibraryInput>;
