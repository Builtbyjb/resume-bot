import { MiddlewareHandler } from "hono";
import { ENV, TokenPayload } from "../lib/types";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

export interface AuthMiddlewareContext {
    Bindings: ENV;
    Variables: { jwtPayload: TokenPayload };
}

export function authMiddleware(): MiddlewareHandler<AuthMiddlewareContext> {
    return async (c, next) => {
        const accessToken = getCookie(c, "access_token");
        if (!accessToken) return c.json({ error: "Unauthorized: Access token not found" }, 401);

        try {
            const payload = (await verify(accessToken, c.env.JWT_SECRET, "HS256")) as TokenPayload;
            c.set("jwtPayload", payload);
            await next();
        } catch (error) {
            console.log(error);
            return c.json({ error: "Unauthorized: Invalid access token" }, 401);
        }
    };
}
