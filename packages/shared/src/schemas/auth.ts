import * as z from "zod";

export const loginSchema = z.object({
    email: z.email("Enter a valid email address."),
});

export const otpSchema = z.object({
    otp: z.string().trim().length(8, "The code is 8 characters long."),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
