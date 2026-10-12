import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, otpSchema } from "@/api/zod-schema";
import { deleteCookie, setCookie } from "hono/cookie";
import { AuthContext, injectService } from "./middleware";
import { TEMP_TOKEN_MAX_AGE, ACCESS_TOKEN_MAX_AGE } from "@/api/helpers";

const authRouteV1 = new Hono<AuthContext>();
authRouteV1.use("*", injectService());

authRouteV1.post("/signin", zValidator("json", loginSchema), async (c) => {
    const data = c.req.valid("json");
    const authService = c.get("service");

    const result = await authService.signin(c, data.email);
    if (result instanceof Error) throw result;

    setCookie(c, "temp_token", result, {
        path: "/",
        secure: true,
        domain: c.env.DOMAIN_NAME,
        httpOnly: true,
        maxAge: TEMP_TOKEN_MAX_AGE,
        expires: new Date(Date.now() + TEMP_TOKEN_MAX_AGE * 1000),
        sameSite: "Strict",
    });

    return c.json({ message: "success" }, 200);
});

authRouteV1.post("/otp", zValidator("json", otpSchema), async (c) => {
    const data = c.req.valid("json");
    const authService = c.get("service");
    const result = await authService.validateOTP(c, data.otp);
    if (result instanceof Error) throw result;

    setCookie(c, "access_token", result.accessToken, {
        path: "/",
        secure: true,
        domain: c.env.DOMAIN_NAME,
        httpOnly: true,
        maxAge: TEMP_TOKEN_MAX_AGE,
        expires: new Date(Date.now() + ACCESS_TOKEN_MAX_AGE * 1000),
        sameSite: "Strict",
    });

    return c.json({ message: "success", userData: { email: result.email } }, 200);
});

authRouteV1.post("signout", async (c) => {
    const authService = c.get("service");
    await authService.signout(c);

    deleteCookie(c, "access_token");

    return c.json({ message: "Signed out successfully" }, 200);
});

export default authRouteV1;
