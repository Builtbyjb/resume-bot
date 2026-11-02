import * as z from "zod";

const jobStatusSchema = z.enum(["queued", "applied", "interviewing", "offer", "rejected", "failed"])
const workModeSchema = z.enum(["remote", "hybrid", "onsite"])
const jobArtifactKindSchema = z.enum(["resume", "cover_letter"])


export const jobArtifactSchema = z.object({
    kind: jobArtifactKindSchema,
    fileName: z.string(),
    url: z.string()
})

export const jobSchema = z.object({
    id: z.string(),
    title: z.string(),
    company: z.string(),
    appliedAt: z.date().nullable(),
    status: jobStatusSchema,
    postingUrl: z.string(),
    location: z.string(),
    workMode: workModeSchema,
    salary: z.string().nullable(),
    source: z.string(),
    description: z.string(),
    artifacts: z.array(jobArtifactSchema)
})

export const jobsSchema = z.array(jobSchema)

export type Job = z.infer<typeof jobSchema>
export type JobArtifact = z.infer<typeof jobArtifactSchema>
export type WorkMode = z.infer<typeof workModeSchema>
export type JobStatus = z.infer<typeof jobStatusSchema>
