import * as z from "zod";
import { autoRechargeLimits } from "../types/billing";

const { min, max } = autoRechargeLimits.threshold;

export const autoRechargeSchema = z.object({
    enabled: z.boolean(),
    threshold: z
        .number({ error: "Enter a number." })
        .int("Use a whole number.")
        .min(min, `Must be between ${min} and ${max}.`)
        .max(max, `Must be between ${min} and ${max}.`),
    packId: z.string().min(1, "Pick a credit pack."),
});

export const checkoutSchema = z.object({
    packId: z.string().min(1).optional(),
});
