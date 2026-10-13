import { Hono } from "hono";
import webRoutes from "./web/routes";
import apiRoutesV1 from "./api/routes/v1";
import { ENV } from "./api/lib/types";
import { HTTPException } from "hono/http-exception";
import { INTERNAL_ERROR_MESSAGE } from "./api/lib/constants";

const app = new Hono<{ Bindings: ENV }>();

app.route("/", webRoutes);
app.route("/api", apiRoutesV1);

app.onError((error, c) => {
    console.error(`${error.message}: ${error.stack}: ${error.cause}`);
    if (error instanceof HTTPException) return error.getResponse();
    return c.json({ error: INTERNAL_ERROR_MESSAGE }, 500);
});

export default {
    fetch: app.fetch,
};
