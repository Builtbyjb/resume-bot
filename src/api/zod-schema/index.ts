import * as z from "zod";

export const loginSchema = z.object({
    email: z.email(),
});

export const otpSchema = z.object({
    otp: z.string().length(8),
});
