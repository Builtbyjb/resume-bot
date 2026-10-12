import { Hono } from "hono";
import LandingPage from "../pages/landing";
import SigninPage from "../pages/signin";
import { html } from "hono/html";
import { authMiddleware } from "@/api/middleware/auth";

const webRoutes = new Hono();

webRoutes.get("/", (c) => {
    return c.html(LandingPage());
});

webRoutes.get("/signin", (c) => {
    return c.html(SigninPage());
});

webRoutes.get(
    "/jobs",
    authMiddleware({
        redirectTo: "/signin",
        alert: "Your session has expired. You have been signed out. Please sign in again to continue.",
    }),
    (c) => {
        return c.html(html`<h1>Jobs</h1>`);
    },
);

export default webRoutes;
