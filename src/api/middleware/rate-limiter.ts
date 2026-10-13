import { MiddlewareHandler } from "hono";
import { ENV, TokenPayload } from "../lib/types";

/** Names of the ENV bindings that are Cloudflare rate limiters (e.g. "RATE_LIMITER"). */
type RateLimitBinding = {
    [K in keyof ENV]: ENV[K] extends RateLimit ? K : never;
}[keyof ENV];

type RateLimiterOptions = {
    /** Keeps limits separate per feature, e.g. "feedback". */
    scope: string;
    /** Which rate limit binding to use. Its limit/period are configured in wrangler.jsonc. */
    binding?: RateLimitBinding;
    message?: string;
};

/**
 * Limits requests per signed-in user (falls back to the client IP when there's no user).
 * Place it after `authMiddleware` so the user ID is available.
 */
export function rateLimiter(
    options: RateLimiterOptions,
): MiddlewareHandler<{ Bindings: ENV; Variables: { jwtPayload?: TokenPayload } }> {
    return async (c, next) => {
        const userID = c.get("jwtPayload")?.userID;
        const client = userID ?? `ip:${c.req.header("cf-connecting-ip") ?? "unknown"}`;

        const { success } = await c.env[options.binding ?? "RATE_LIMITER"].limit({
            key: `${options.scope}:${client}`,
        });

        if (!success) {
            c.header("Retry-After", "60");
            return c.json(
                { error: options.message ?? "Too many requests. Please try again later." },
                429,
            );
        }

        await next();
    };
}
