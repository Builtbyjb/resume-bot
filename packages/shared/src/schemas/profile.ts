import * as z from "zod";

const yearMonth = z.string().regex(/^\d{4}-\d{2}$/, "Use the YYYY-MM format.");
const optionalYearMonth = yearMonth.nullable();
const optionalUrl = z.union([
    z.literal(""),
    z.url({ protocol: /^https?$/, error: "Enter a full link, starting with https://" }),
]);
const required = (label: string, max: number) =>
    z.string().trim().min(1, `Add ${label}.`).max(max, `Keep it under ${max} characters.`);
const optional = (max: number) => z.string().max(max, `Keep it under ${max} characters.`);

const endNotBeforeStart = (entry: { startDate: string | null; endDate: string | null }) =>
    !entry.startDate || !entry.endDate || entry.endDate >= entry.startDate;
const dateOrderIssue = { message: "End date can't be before the start date.", path: ["endDate"] };

export const experienceSchema = z
    .object({
        id: z.string(),
        title: required("a job title", 120),
        company: required("a company", 120),
        location: optional(120),
        startDate: z.string().min(1, "Add a start date.").pipe(yearMonth),
        endDate: optionalYearMonth,
        current: z.boolean(),
        achievements: z.array(z.string()),
    })
    .refine((entry) => entry.current || endNotBeforeStart(entry), dateOrderIssue);

export const educationSchema = z
    .object({
        id: z.string(),
        school: required("a school", 120),
        degree: required("a degree", 120),
        field: optional(120),
        startDate: optionalYearMonth,
        endDate: optionalYearMonth,
        notes: optional(300),
    })
    .refine(endNotBeforeStart, dateOrderIssue);

export const languageSchema = z.object({
    id: z.string(),
    name: required("a language", 60),
    proficiency: z.enum(["basic", "conversational", "professional", "native"]),
});

export const projectSchema = z.object({
    id: z.string(),
    name: required("a project name", 120),
    url: optionalUrl,
    description: optional(1500),
});

export const certificationSchema = z.object({
    id: z.string(),
    name: required("a certification name", 120),
    issuer: optional(120),
    issuedOn: optionalYearMonth,
    url: optionalUrl,
});

const tags = z.array(z.string().trim().min(1).max(60));

/** The editable profile. The resume is uploaded separately. */
export const profileSchema = z.object({
    firstName: optional(60),
    lastName: optional(60),
    phone: optional(30),
    location: optional(120),
    links: z.object({ linkedin: optionalUrl, github: optionalUrl, portfolio: optionalUrl }),
    headline: optional(120),
    summary: optional(1500),
    experience: z.array(experienceSchema),
    education: z.array(educationSchema),
    skills: tags,
    languages: z.array(languageSchema),
    projects: z.array(projectSchema),
    certifications: z.array(certificationSchema),
    preferences: z.object({
        titles: tags,
        locations: tags,
        workModes: z.array(z.enum(["remote", "hybrid", "onsite"])),
        minSalary: z.object({
            amount: z.number().int().min(0, "Can't be negative.").nullable(),
            currency: z.string().length(3),
            period: z.enum(["year", "hour"]),
        }),
        excludedCompanies: tags,
        jobBoards: z.array(
            z.enum(["linkedin", "indeed", "glassdoor", "wellfound", "hacker_news", "company_sites"]),
        ),
    }),
    application: z.object({
        workAuthorized: z.boolean().nullable(),
        needsSponsorship: z.boolean().nullable(),
        willingToRelocate: z.boolean().nullable(),
        noticePeriod: z.enum([
            "immediately",
            "1_week",
            "2_weeks",
            "1_month",
            "2_months",
            "3_months_plus",
        ]),
        earliestStart: z.iso.date().nullable(),
    }),
    writing: z.object({
        tone: z.enum(["professional", "friendly", "enthusiastic", "concise"]),
        instructions: optional(2000),
    }),
});

export type ProfileInput = z.infer<typeof profileSchema>;
