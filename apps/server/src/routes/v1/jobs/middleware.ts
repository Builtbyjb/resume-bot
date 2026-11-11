import { ENV } from "@/lib/types";
import { drizzle } from "drizzle-orm/d1";
import { JobService } from "./service";
import { MiddlewareHandler } from "hono";
import { JobRepository } from "./repository";

export interface JobContext {
    Bindings: ENV;
    Variables: { service: JobService }
}

export function injectService(): MiddlewareHandler<JobContext> {
    return async (c, next) => {
        const db = drizzle(c.env.DB);
        const repository = new JobRepository(db)
        const service = new JobService(repository)

        c.set("service", service);
        await next();
    }
}
