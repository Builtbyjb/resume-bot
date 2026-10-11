import { Hono } from "hono";

export const loginRouteV1 = new Hono().get("/", (c) => {
    return c.json({ message: "sucess" }, 200);
});
