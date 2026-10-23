import { Hono } from "hono";

const notFound = new Hono();

notFound.get("/", (c) => {
    return c.html(`<h1>Not Found</h1>`);
});

export default notFound;
