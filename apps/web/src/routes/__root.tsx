import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import NotFound from "@/components/notfound";
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
