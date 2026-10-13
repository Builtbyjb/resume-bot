import { MiddlewareHandler } from "hono";
import { ENV, TokenPayload } from "../lib/types";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { decode, verify } from "hono/jwt";
import { JwtTokenExpired, JwtTokenInvalid } from "hono/utils/jwt/types";
import type { Context } from "hono";
import { TokenHeader } from "hono/utils/jwt/jwt";
import { getAccessTokenExp, signJWTToken } from "../helpers";

export interface AuthMiddlewareContext {
    Bindings: ENV;
    Variables: { jwtPayload: TokenPayload };
}

type AuthMiddlewareOptions = {
    redirectTo?: string;
    alert?: string;
};

type RefreshedToken = {
    newAccessToken: string;
    newPayload: TokenPayload;
};

async function refreshJWTToken(
    c: Context<AuthMiddlewareContext>,
    accessToken: string,
): Promise<RefreshedToken> {
    const { payload } = decode(accessToken) as { header: TokenHeader; payload: TokenPayload };

    // fetch refresh token
    const refreshToken = await c.env.KV.get(`${payload.userID}:refresh_token`);
    if (!refreshToken) throw new Error("Refresh token not found");

    try {
        // Verify refresh token
        const refreshPayload = (await verify(
            refreshToken,
            c.env.JWT_SECRET,
            "HS256",
        )) as TokenPayload;

        // Generate new access token
        const accessPayload: TokenPayload = {
            userID: refreshPayload.userID,
            email: refreshPayload.email,
            exp: getAccessTokenExp(),
        };

        const newAccessToken = await signJWTToken(c.env.JWT_SECRET, accessPayload);

        return { newAccessToken, newPayload: accessPayload };
    } catch (error) {
        console.log(error);
        await c.env.KV.delete(`${payload.userID}:refresh_token`);
        throw new Error("Invalid refresh token");
    }
}

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

            if (error instanceof JwtTokenInvalid) return deny("Unauthorized: Invalid access token");
            // Refresh token if expired
            if (error instanceof JwtTokenExpired) {
                deleteCookie(c, "access_token", {
                    path: "/",
                    domain: c.env.DOMAIN_NAME,
                });

                try {
                    const { newAccessToken, newPayload } = await refreshJWTToken(c, accessToken);
                    c.set("jwtPayload", newPayload);

                    // Set new access token cookie
                    setCookie(c, "access_token", newAccessToken, {
                        path: "/",
                        secure: true,
                        domain: c.env.DOMAIN_NAME,
                        httpOnly: true,
                        sameSite: "Strict",
                    });

                    await next();
                } catch (error) {
                    console.log(error);
                    return deny("Unauthorized: Expired tokens");
                }
            }
        }
    };
}
