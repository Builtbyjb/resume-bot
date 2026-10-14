import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { containerClass } from "@/components/layout/container";

export const Route = createFileRoute("/_guest")({
    component: GuestLayout,
});

function GuestLayout() {
    return (
        <>
            <header className="sticky top-0 z-10">
                <nav
                    className={`${containerClass} flex h-16 items-center justify-between bg-bg opacity-90`}
                >
                    <Link to="/">
                        <div>
                            <p className="font-mono font-bold italic">JobBot</p>
                        </div>
                    </Link>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
            <footer className="py-8 text-center text-[0.875rem] text-muted">
                <div className={containerClass}>
                    &copy; {new Date().getFullYear()} ACorp. All rights reserved.
                </div>
            </footer>
        </>
    );
}
