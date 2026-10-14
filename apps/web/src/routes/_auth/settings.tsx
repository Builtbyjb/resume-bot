import { createFileRoute } from "@tanstack/react-router";
import { mockSettings } from "@/data/mock-settings";
import { SettingsPage } from "@/features/settings/settings-page";

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
    // TODO: replace with the user's settings from the API once the settings endpoints exist
    loader: () => ({ settings: mockSettings }),
    component: SettingsRoute,
});

function SettingsRoute() {
    const { settings } = Route.useLoaderData();
    const { user } = Route.useRouteContext();
    return <SettingsPage settings={settings} email={user.email} />;
}
