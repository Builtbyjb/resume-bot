import * as z from "zod"

const workModeSchema = z.enum(["remote", "hybrid", "onsite"])
const experienceSchema = z.object({
    title: z.string(),
    location: z.string(),
    company: z.string(),
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
    achievements: z.array(z.string())
})

export const profileSchema = z.object({
    name: z.string(),
    role: z.string(),
    phone: z.string(),
    address: z.string(),
    experience: z.array(experienceSchema),
    salary: z.string(),
    workMode: workModeSchema,
    location: z.string(),
    radius: z.string(),
})

export type Profile = z.infer<typeof profileSchema>
