import { users } from "@/api/db/schema";
import { User } from "@/api/lib/types";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { and, eq } from "drizzle-orm";

export class AuthRepository {
    private readonly db: DrizzleD1Database;

    constructor(drizzleDB: DrizzleD1Database) {
        this.db = drizzleDB;
    }

    public async createUser(email: string): Promise<User> {
        const user = await this.db
            .insert(users)
            .values({ email: email })
            .returning()
            .then((result) => result[0]);

        return user;
    }
    public async findUserByEmail(email: string): Promise<User> {
        const user = this.db
            .select()
            .from(users)
            .where(and(eq(users.email, email), eq(users.deleted, false)))
            .then((result) => result[0]);

        return user;
    }
}
