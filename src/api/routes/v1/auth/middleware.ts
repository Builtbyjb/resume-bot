import { MiddlewareHandler } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { ENV } from "@/api/lib/types";
import { AuthRepository } from "./repository";
import { AuthService } from "./service";

export interface AuthContext {
    Bindings: ENV;
    Variables: { service: AuthService };
}

export function injectService(): MiddlewareHandler<AuthContext> {
    return async (c, next) => {
        const db = drizzle(c.env.DB);
        const repository = new AuthRepository(db);
        const service = new AuthService(repository);

        c.set("service", service);

        await next();
    };
}
