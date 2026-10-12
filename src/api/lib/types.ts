import { ContentfulStatusCode } from "hono/utils/http-status";
import { JWTPayload } from "hono/utils/jwt/types";
import { users } from "../db/schema";

export type User = typeof users.$inferSelect;

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
};

export type BaseTokenPayload = {
    userID: string;
    email: string;
    otp?: string;
};

export type TokenPayload = JWTPayload & BaseTokenPayload;

export class APIError extends Error {
    public code: ContentfulStatusCode;

    constructor(message: string, code: ContentfulStatusCode, options?: ErrorOptions) {
        super(message, options);

        this.code = code;
        this.name = "APIError";

        Object.setPrototypeOf(this, APIError.prototype);
    }
}
