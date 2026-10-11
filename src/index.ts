import { Hono } from "hono";
import webRoutes from "./web/routes";
import apiRoutesV1 from "./api/routes/v1";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.route("/", webRoutes);
app.route("/api", apiRoutesV1);

export default {
    fetch: app.fetch,
};
