import { Hono } from "hono";
import webRoutes from "./web/routes";
import apiRoutesV1 from "./api/routes/v1";
import { ENV } from "./api/lib/types";

const app = new Hono<{ Bindings: ENV }>();

app.route("/", webRoutes);
app.route("/api", apiRoutesV1);

export default {
    fetch: app.fetch,
};
