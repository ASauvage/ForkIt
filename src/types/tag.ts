export interface Tag {
    id: string;
    name: string;
    color: string | null;
    created_at: Date;
    updated_at: Date;
}

export type TagReference = Pick<Tag, "id">;

export interface SelectTagInput {
    id?: Array<string>;
    name?: string;
    created_at_from?: Date;
    created_at_to?: Date;
    updated_at_from?: Date;
    updated_at_to?: Date;
    limit?: number;
}

export interface CreateTagInput {
    name: string;
    color?: string;
}

export type UpdateTagInput = Partial<CreateTagInput>;
