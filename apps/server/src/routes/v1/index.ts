import { Hono } from "hono";
import authRouteV1 from "./auth";
import jobsRouteV1 from "./jobs";
import profileRouteV1 from "./profile";

const apiRoutesV1 = new Hono();

apiRoutesV1.route("/auth", authRouteV1);
apiRoutesV1.route("/jobs", jobsRouteV1);
apiRoutesV1.route("/profile", profileRouteV1)

export default apiRoutesV1;
