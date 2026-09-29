import type { User } from "./user.js";

export interface Library {
    id: string;
    name: string;
    owner: Partial<Omit<User, "id">>;
    created_at: Date;
    updated_at: Date;
}
