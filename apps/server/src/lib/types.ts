import { JWTPayload } from "hono/utils/jwt/types";
import { profiles, settings, users } from "@/db/schema";


export type ENV = {
    DB: D1Database;
    OTP_EMAIL: string;
    JWT_SECRET: string;
    SEND_EMAIL: {
        send: (email: {
            to: string;
            from: string;
            subject: string;
            text: string;
            html?: string;
        }) => Promise<any>;
    };
    ENV: string;
    RATE_LIMITER: RateLimit;
    KV: KVNamespace;
    DOMAIN_NAME: string;
    MODEL_API_KEY: string;
    MODEL_BASE_URL: string;
    MODEL_NAME: string;
};

export type BaseTokenPayload = {
    userID: string;
    email: string;
    otp?: string;
};

export type TokenPayload = JWTPayload & BaseTokenPayload;

export type WorkMode = "remote" | "hybrid" | "onsite"

export type JobDetails = {
    role: string | null,
    jobBoards: unknown,
    experiences: string | null,
    salary: string | null,
    workMode: WorkMode | null,
    location: string | null,
    radius: string | null // km,
    lastPostedDate: string
}

/* DB Schema types */
export type UserSchema = typeof users.$inferSelect;
export type ProfileSchema = typeof profiles.$inferSelect;
export type SettingSchema = typeof settings.$inferSelect;
