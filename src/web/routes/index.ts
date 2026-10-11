import { Hono } from "hono";
import LandingPage from "../pages/landing";
import LoginPage from "../pages/login";

const webRoutes = new Hono();

webRoutes.get("/", (c) => {
    return c.html(LandingPage());
});

webRoutes.get("/login", (c) => {
    return c.html(LoginPage());
});

export default webRoutes;
