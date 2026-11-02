import { Hono } from "hono";
import authRouteV1 from "./auth";
import jobsRouteV1 from "./jobs";

const apiRoutesV1 = new Hono();

apiRoutesV1.route("/auth", authRouteV1);
apiRoutesV1.route("/jobs", jobsRouteV1)

export default apiRoutesV1;
