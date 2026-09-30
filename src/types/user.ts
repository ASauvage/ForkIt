export interface User {
    id: string;
    mail: string;
    name: string;
    image_url: string | null;
    permissions: number;
    created_at: Date;
    updated_at: Date;
}

export type UserReference = Pick<User, "id">; 

export interface SelectUserInput {
    id?: string | Array<string>;
    mail?: string;
    name?: string;
    permissions?: number;
    created_at?: Date;
    updated_at?: Date;
    limit?: number;
}

export interface CreateUserInput {
    mail: string;
    name: string;
    image_url?: string;
    permissions?: number;
}

export type UpdateUserInput = Partial<CreateUserInput>;
