import { createFileRoute } from "@tanstack/react-router";
import { mockJobs } from "@/data/mock-jobs";
import { JobsPage } from "@/features/jobs/jobs-page";

export const Route = createFileRoute("/_auth/jobs")({
    head: () => ({
        meta: [
            { title: "Jobs - Job Bot" },
            { name: "description", content: "List of all the jobs the bot applied to" },
        ],
    }),
    // TODO: replace with the user's jobs from the API once the jobs endpoints exist
    loader: () => ({ jobs: mockJobs }),
    component: JobsRoute,
});

function JobsRoute() {
    const { jobs } = Route.useLoaderData();
    return <JobsPage jobs={jobs} />;
}
