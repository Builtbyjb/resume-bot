import { users } from "@/db/schema";
import { UserSchema } from "@/lib/types";
import { eq } from "drizzle-orm";
import { DrizzleD1Database } from "drizzle-orm/d1";

export class UserRepository {
    private readonly db: DrizzleD1Database

    constructor(db: DrizzleD1Database) {
        this.db = db
    }

    public async findAllUsers(): Promise<UserSchema[]> {
        const result = await this.db.select().from(users).where(eq(users.deleted, false))
        if (!result || result.length === 0) throw new Error("No users found")

        return result
    }
}
