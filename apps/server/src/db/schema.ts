import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
    id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: text().notNull().unique(),
    deleted: int({ mode: "boolean" }).notNull().default(false),
    createdAt: int("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
    updatedAt: int("updated_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`)
        .$onUpdateFn(() => new Date()),
});

export const profiles = sqliteTable("profiles", {
    id: int().primaryKey(),
    userID: text("user_id").references(() => users.id),
    name: text("name"),
    role: text(),
    experience: text(),
    salary: text(),
    workMode: text("work_mode", { enum: ["remote", "hybrid", "onsite"] }),
    location: text(),
    radius: text(),
    deleted: int({ mode: "boolean" }).notNull().default(false),
    createdAt: int("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
    updatedAt: int("updated_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`)
        .$onUpdateFn(() => new Date()),
})

export const jobs = sqliteTable("jobs", {
    id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
    userID: text("user_id").references(() => users.id),
    title: text(),
    company: text(),
    appliedAt: int("applied_at", { mode: "timestamp" }),
    status: text({
        enum: ["queued", "applied", "interviewing", "offer", "rejected", "failed"]
    }),
    postingUrl: text("posting_url"),
    postedDate: int("posted_date", { mode: "timestamp" }),
    location: text(),
    workMode: text("work_mode", { enum: ["remote", "hybrid", "onsite"] }),
    salary: text(),
    source: text(),
    description: text(),
    deleted: int({ mode: "boolean" }).notNull().default(false),
    createdAt: int("updated_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
    updatedAt: int("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`)
        .$onUpdateFn(() => new Date()),
})

export const settings = sqliteTable("settings", {
    id: int().primaryKey(),
    userID: text("user_id").references(() => users.id),
    jobBoards: text({ mode: "json" }).$type<unknown>(),
    interval: text(), // Probably json
    lastPostedDate: int("last_posted_date", { mode: "timestamp" }),
    deleted: int({ mode: "boolean" }).notNull().default(false),
    createdAt: int("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
    updatedAt: int("updated_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`)
        .$onUpdateFn(() => new Date()),
})
