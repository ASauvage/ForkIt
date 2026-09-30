export interface Tag {
    id: string;
    name: string;
    color: string;
    created_at: Date;
    updated_at: Date;
}

export type TagReference = Pick<Tag, "id">;

export interface CreateTagInput {
    name: string;
    color?: string;
}

export type UpdateTagInput = Partial<CreateTagInput>;
