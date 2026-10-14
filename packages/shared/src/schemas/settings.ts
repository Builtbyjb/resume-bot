import * as z from "zod";
import { settingsLimits } from "../types/settings";

const between = (min: number, max: number) =>
    z
        .number({ error: "Enter a number." })
        .int("Use a whole number.")
        .min(min, `Must be between ${min} and ${max}.`)
        .max(max, `Must be between ${min} and ${max}.`);

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Enter a valid time.");

export const botSettingsSchema = z.object({
    enabled: z.boolean(),
    jobsPerRun: between(settingsLimits.jobsPerRun.min, settingsLimits.jobsPerRun.max),
    interval: z
        .object({
            value: z.number({ error: "Enter a number." }),
            unit: z.enum(["minutes", "hours", "days"]),
        })
        .superRefine(({ value, unit }, ctx) => {
            const { min, max } = settingsLimits.interval[unit];
            const result = between(min, max).safeParse(value);
            if (!result.success) {
                ctx.addIssue({
                    code: "custom",
                    path: ["value"],
                    message: result.error.issues[0]?.message ?? "Invalid interval.",
                });
            }
        }),
    dailyCap: between(settingsLimits.dailyCap.min, settingsLimits.dailyCap.max),
    activeHours: z
        .object({ start: time, end: time })
        .refine((hours) => hours.start !== hours.end, {
            message: "Start and end time can't be the same.",
            path: ["end"],
        }),
    activeDays: z
        .array(z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]))
        .min(1, "Pick at least one day."),
    timezone: z.string().min(1, "Pick a timezone."),
    reviewBeforeApplying: z.boolean(),
    generateCoverLetters: z.boolean(),
    notifications: z.enum(["every", "digest", "failures", "off"]),
});
