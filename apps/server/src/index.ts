import { Hono } from "hono";
import apiRoutesV1 from "./routes/v1";
import notFound from "./routes/v1/notFound";
import { ENV } from "@/lib/types";
import { HTTPException } from "hono/http-exception";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import { findJobs } from "./cron";
import { drizzle } from "drizzle-orm/d1";

const app = new Hono<{ Bindings: ENV }>();

app.route("/api/v1", apiRoutesV1);

app.route("*", notFound);

app.onError((error, c) => {
    console.error(`${error.message}: ${error.stack}: ${error.cause}`);
    if (error instanceof HTTPException) return error.getResponse();
    return c.json({ error: INTERNAL_ERROR_MESSAGE }, 500);
});

export default {
    fetch: app.fetch,

    async scheduled(controller: ScheduledController, env: ENV, ctx: ExecutionContext) {
        switch (controller.cron) {
            case "0 8 * * *":
                // Run every morning at 8:00 AM
                const db = drizzle(env.DB)
                await findJobs(env, db);
                console.log("Done!")
                break;
        }

        return
    }
};
