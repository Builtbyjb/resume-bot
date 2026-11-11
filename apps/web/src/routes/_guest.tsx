import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_guest")({
  component: GuestLayout,
});

function GuestLayout() {
  return (
    <main className="w-[80%] mx-auto">
      <header className="sticky top-0 z-10">
        <nav className="flex h-16 items-center justify-between bg-background opacity-90" >
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
        <div >
          &copy; {new Date().getFullYear()} ACorp. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
