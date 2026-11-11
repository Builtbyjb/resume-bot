import { profiles } from "@/db/schema";
import { ProfileSchema } from "@/lib/types";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export class ProfileRepository {
    private readonly db: DrizzleD1Database

    constructor(db: DrizzleD1Database) {
        this.db = db
    }

    public async findProfileByUserID(userID: string): Promise<ProfileSchema> {
        const result = await this.db.select()
            .from(profiles)
            .where(and(eq(profiles.userID, userID), eq(profiles.deleted, false)))
            .then((result) => result[0])

        if (!result) {
            console.log(`No profile found for user: ${userID}`)
            throw new HTTPException(404, { message: "No profile found" })
        }

        return result
    }
}
