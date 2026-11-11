import { ENV } from "@/lib/types";
import { MiddlewareHandler } from "hono";
import { ProfileService } from "./service";
import { drizzle } from "drizzle-orm/d1";
import { ProfileRepository } from "./repository";

export interface ProfileContext {
    Bindings: ENV
    Variables: { service: ProfileService }
}

export function injectService(): MiddlewareHandler<ProfileContext> {
    return async (c, next) => {
        const db = drizzle(c.env.DB)
        const profileRepository = new ProfileRepository(db)
        const profileService = new ProfileService(profileRepository)

        c.set("service", profileService)

        await next()
    }
}
