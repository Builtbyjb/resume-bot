import { authMiddleware } from "@/middleware/auth";
import { Hono } from "hono";
import { injectService, JobContext } from "./middleware";
import { TokenPayload } from "@/lib/types";

const jobsRouteV1 = new Hono<JobContext>()
jobsRouteV1.use("*", authMiddleware())
jobsRouteV1.use("*", injectService())

jobsRouteV1.get("/", async (c) => {
    const jwt = c.get("jwtPayload") as TokenPayload
    const jobService = c.get("service")

    const jobs = await jobService.fetchJobs(jwt.userID)

    return c.json({ message: "success", data: jobs }, 200)
})

export default jobsRouteV1;
