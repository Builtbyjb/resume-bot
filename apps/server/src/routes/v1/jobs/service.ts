import { Job } from "@resume-bot/shared";
import { JobRepository } from "./repository";

export class JobService {
    private readonly repo: JobRepository

    constructor(jobRepository: JobRepository) {
        this.repo = jobRepository
    }

    public async fetchJobs(userID: string): Promise<Job[]> {
        return this.repo.findJobsByUserID(userID)
    }
}
