import { Hono } from "hono";
import apiRoutesV1 from "./routes/v1";
import notFound from "./routes/v1/notFound";
import { ENV } from "@/lib/types";
import { HTTPException } from "hono/http-exception";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";

const app = new Hono<{ Bindings: ENV }>();

app.route("*", notFound);
app.route("/api", apiRoutesV1);

app.onError((error, c) => {
    console.error(`${error.message}: ${error.stack}: ${error.cause}`);
    if (error instanceof HTTPException) return error.getResponse();
    return c.json({ error: INTERNAL_ERROR_MESSAGE }, 500);
});

export default {
    fetch: app.fetch,
};
