import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { setUnauthorizedHandler } from "./lib/api";
import { clearUserData, SESSION_EXPIRED_MESSAGE } from "./lib/auth";
import { routeTree } from "./routeTree.gen";
import "./index.css";

const router = createRouter({ routeTree, scrollRestoration: true });

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

let redirectingToSignin = false;
setUnauthorizedHandler(() => {
    if (redirectingToSignin) return;
    redirectingToSignin = true;
    clearUserData();
    alert(SESSION_EXPIRED_MESSAGE);
    void router.navigate({ to: "/signin" }).finally(() => {
        redirectingToSignin = false;
    });
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);
