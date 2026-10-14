import { createFileRoute } from "@tanstack/react-router";
import { mockProfile } from "@/data/mock-profile";
import { ProfilePage } from "@/features/profile/profile-page";

export const Route = createFileRoute("/_auth/profile")({
    head: () => ({
        meta: [
            { title: "Profile - Job Bot" },
            {
                name: "description",
                content: "Your details for personalized resumes and cover letters",
            },
        ],
    }),
    // TODO: replace with the user's profile from the API once the profile endpoints exist
    loader: () => ({ profile: mockProfile }),
    component: ProfileRoute,
});

function ProfileRoute() {
    const { profile } = Route.useLoaderData();
    const { user } = Route.useRouteContext();
    return <ProfilePage profile={profile} email={user.email} />;
}
