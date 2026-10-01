import { db } from "@db/index.js";
import { usersTable } from "@db/schemas/users.js";
import { eq } from "drizzle-orm";
import type { User } from "@app-types/user.js"

export async function selectUserByMail(mail: string): Promise<User & { password_hash: string;} | null> {
    const results = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.mail, mail));
    
    return results[0] ?? null;
}
