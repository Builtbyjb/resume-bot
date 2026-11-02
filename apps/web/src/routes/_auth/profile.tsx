import { createFileRoute } from "@tanstack/react-router";

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
  // loader: () => ({ profile: mockProfile }),
  component: ProfileRoute,
});

function ProfileRoute() {

  return (
    <>
      <h1>Profile</h1>
    </>
  );
}
