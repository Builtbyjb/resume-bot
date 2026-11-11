import { authMiddleware } from "@/middleware/auth";
import { Hono } from "hono";
import { injectService, ProfileContext } from "./middleware";
import { TokenPayload } from "@/lib/types";


const profileRouteV1 = new Hono<ProfileContext>()
profileRouteV1.use("*", authMiddleware())
profileRouteV1.use("*", injectService())

profileRouteV1.get("/", async (c) => {
    const jwt = c.get("jwtPayload") as TokenPayload
    const profileService = c.get("service")

    const profile = await profileService.getUserProfile(jwt.userID)

    return c.json({ message: "success", data: profile }, 200)
})

export default profileRouteV1;
