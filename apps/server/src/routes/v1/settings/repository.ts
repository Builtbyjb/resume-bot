import { settings } from "@/db/schema"
import { SettingSchema } from "@/lib/types"
import { and, eq } from "drizzle-orm"
import { DrizzleD1Database } from "drizzle-orm/d1"

export class SettingsRepository {
    private readonly db: DrizzleD1Database

    constructor(db: DrizzleD1Database) {
        this.db = db
    }

    public async findSettingsByUserID(userID: string): Promise<SettingSchema> {
        const result = await this.db.select()
            .from(settings)
            .where(and(eq(settings.userID, userID), eq(settings.deleted, false)))
            .then((result) => result[0])

        if (!result) throw new Error(`No setting found for user: ${userID}`)

        return result;
    }
}
