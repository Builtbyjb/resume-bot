import { authMiddleware } from "@/middleware/auth";
import { Hono } from "hono";

const jobsRouteV1 = new Hono()
jobsRouteV1.use("*", authMiddleware())

jobsRouteV1.get("/", (c) => {
    return c.json({ message: "success", data: [] }, 200)
})

export default jobsRouteV1;
