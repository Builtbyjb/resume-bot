import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
    id: text()
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    email: text().notNull().unique(),
    name: text(),
    deleted: int({ mode: "boolean" }).notNull().default(false),
    createdAt: int({ mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
    updatedAt: int({ mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`)
        .$onUpdateFn(() => new Date()),
});
