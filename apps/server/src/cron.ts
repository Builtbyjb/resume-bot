import { ENV, JobDetails } from "./lib/types";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { ProfileRepository } from "./routes/v1/profile/repository";
import { SettingsRepository } from "./routes/v1/settings/repository";
import { JobRepository } from "./routes/v1/jobs/repository";
import { AgentService } from "./agent";
import { UserRepository } from "./routes/v1/user/repository";

export async function findJobs(env: ENV, db: DrizzleD1Database) {

    const users = await new UserRepository(db).findAllUsers()
    await Promise.allSettled(users.map(async (user) => {
        try {
            const profile = await new ProfileRepository(db).findProfileByUserID(user.id)
            const setting = await new SettingsRepository(db).findSettingsByUserID(user.id)
            const jobRepository = new JobRepository(db)

            const agents = new AgentService(env)

            const jobDetails: JobDetails = {
                role: profile.role,
                jobBoards: setting.jobBoards,
                experiences: profile.experience,
                salary: profile.salary,
                workMode: profile.workMode,
                location: profile.location,
                radius: profile.radius,
                lastPostedDate: setting.lastPostedDate
                    ? setting.lastPostedDate.toLocaleString() : new Date().toLocaleString()
            }

            const jobs = await agents.findJobs(jobDetails)

            await jobRepository.addJobs(user.id, jobs)

        } catch (error) {
            if (error instanceof Error) console.log(error.message)
        }
    }))
}
