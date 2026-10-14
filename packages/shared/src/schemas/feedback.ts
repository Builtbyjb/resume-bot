import * as z from "zod";
import { feedbackLimits } from "../types/feedback";

export const feedbackSchema = z.object({
    type: z.enum(["suggestion", "issue"]),
    title: z
        .string()
        .trim()
        .min(1, "Add a title.")
        .max(feedbackLimits.title.max, `Keep the title under ${feedbackLimits.title.max} characters.`),
    description: z
        .string()
        .trim()
        .min(
            feedbackLimits.description.min,
            `Use at least ${feedbackLimits.description.min} characters.`,
        )
        .max(
            feedbackLimits.description.max,
            `Keep it under ${feedbackLimits.description.max} characters.`,
        ),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;
