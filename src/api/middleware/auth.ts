import { MiddlewareHandler } from "hono";
import { ENV, TokenPayload } from "../lib/types";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

export interface AuthMiddlewareContext {
    Bindings: ENV;
    Variables: { jwtPayload: TokenPayload };
}

type AuthMiddlewareOptions = {
    redirectTo?: string;
    alert?: string;
};

export function authMiddleware(
    options?: AuthMiddlewareOptions,
): MiddlewareHandler<AuthMiddlewareContext> {
    return async (c, next) => {
        const deny = (msg: string) => {
            if (options?.redirectTo && options.alert) {
                const script = `
                <script>
                    alert(${JSON.stringify(options.alert)});
                    window.location.href=${JSON.stringify(options.redirectTo)};
                </script>
                `;
                return c.html(script, 401);
            }

            if (options?.redirectTo) return c.redirect(options.redirectTo, 302);
            return c.json({ error: msg }, 401);
        };

        const accessToken = getCookie(c, "access_token");
        if (!accessToken) return deny("Unauthorized: Access token not found");

        try {
            const payload = (await verify(accessToken, c.env.JWT_SECRET, "HS256")) as TokenPayload;
            c.set("jwtPayload", payload);
            await next();
        } catch (error) {
            console.log(error);
            return deny("Unauthorized: Invalid access token");
        }
    };
}
