import { Hono } from "hono";
import { loginRouteV1 } from "./auth";

const apiRoutesV1 = new Hono().basePath("/v1");

apiRoutesV1.route("/login", loginRouteV1);

export default apiRoutesV1;
