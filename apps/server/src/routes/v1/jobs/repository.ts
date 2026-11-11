import { jobs } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { Job, jobsSchema } from "@resume-bot/shared";

export class JobRepository {
    private readonly db: DrizzleD1Database

    constructor(drizzleDB: DrizzleD1Database) {
        this.db = drizzleDB
    }

    public async findJobsByUserID(userID: string): Promise<Job[]> {
        const result = await this.db.select()
            .from(jobs)
            .where(and(eq(jobs.userID, userID), eq(jobs.deleted, false)))

        return jobsSchema.parse(result)
    }

    public async addJobs(userID: string, newJobs: Job[]) {
        if (newJobs.length === 0) return

        this.db.transaction(async (tx) => {
            newJobs.forEach(async (j) => {
                await tx.insert(jobs).values({
                    userID: userID,
                    title: j.title,
                    company: j.company,
                    status: "queued",
                    postingUrl: j.postingUrl,
                    postedDate: j.postedDate,
                    location: j.location,
                    workMode: j.workMode,
                    salary: j.salary,
                    source: j.source,
                    description: j.description
                })
            })
        })
    }
}
