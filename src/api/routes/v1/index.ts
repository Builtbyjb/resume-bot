import { Hono } from "hono";
import authRouteV1 from "./auth";

const apiRoutesV1 = new Hono().basePath("/v1");

apiRoutesV1.route("/", authRouteV1);

export default apiRoutesV1;
