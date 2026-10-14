import { createRootRoute, HeadContent, Link, Outlet } from "@tanstack/react-router";
import { ToastProvider } from "@/components/ui/toast";

export const Route = createRootRoute({
    head: () => ({
        meta: [
            { title: "Resume Bot" },
            { name: "description", content: "Automatic resume application using AI" },
        ],
    }),
    component: RootLayout,
    notFoundComponent: NotFound,
});

function RootLayout() {
    return (
        <>
            <HeadContent />
            <ToastProvider>
                <Outlet />
            </ToastProvider>
        </>
    );
}

function NotFound() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
            <h1 className="text-[2rem]">Page not found</h1>
            <Link to="/" className="text-accent hover:underline">
                Back to home
            </Link>
        </main>
    );
}
