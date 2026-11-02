import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/settings")({
  head: () => ({
    meta: [
      { title: "Settings - Job Bot" },
      {
        name: "description",
        content: "Control how the bot searches for and applies to jobs",
      },
    ],
  }),
  // loader: () => ({ settings: mockSettings }),
  component: SettingsRoute,
});

function SettingsRoute() {
  return <h1>Settings</h1>;
}
