import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, otpSchema } from "@resume-bot/shared";
import { deleteCookie, setCookie } from "hono/cookie";
import { AuthContext, injectService } from "./middleware";
import { TEMP_TOKEN_MAX_AGE } from "../../../helpers";
import { authMiddleware } from "../../../middleware/auth";

const authRouteV1 = new Hono<AuthContext>();
authRouteV1.use("*", injectService());

authRouteV1.post("/signin", zValidator("json", loginSchema), async (c) => {
    const data = c.req.valid("json");
    const authService = c.get("service");

    const result = await authService.signin(c, data.email);

    setCookie(c, "temp_token", result, {
        path: "/",
        secure: true,
        domain: c.env.DOMAIN_NAME,
        httpOnly: true,
        maxAge: TEMP_TOKEN_MAX_AGE,
        sameSite: "Strict",
    });

    return c.json({ message: "success" }, 200);
});

authRouteV1.post("/otp", zValidator("json", otpSchema), async (c) => {
    const data = c.req.valid("json");
    const authService = c.get("service");
    const result = await authService.validateOTP(c, data.otp);

    setCookie(c, "access_token", result.accessToken, {
        path: "/",
        secure: true,
        domain: c.env.DOMAIN_NAME,
        httpOnly: true,
        sameSite: "Strict",
    });

    return c.json({ message: "success", userData: { email: result.email } }, 200);
});

authRouteV1.post("/signout", async (c) => {
    const authService = c.get("service");
    await authService.signout(c);

    deleteCookie(c, "access_token", {
        path: "/",
        domain: c.env.DOMAIN_NAME,
    });

    return c.json({ message: "Signed out successfully" }, 200);
});

authRouteV1.get("/me", authMiddleware(), (c) => {
    return c.json({ email: c.get("jwtPayload").email }, 200);
});

export default authRouteV1;
