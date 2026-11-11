import { useRef, useState } from "react";
import { type Job, jobsSchema } from "@resume-bot/shared";
import { createFileRoute, Link } from "@tanstack/react-router";
import { TriangleAlert, X } from "lucide-react"
import JobsTable from "@/components/jobs/jobs-table";
import JobDetail from "@/components/jobs/jobs-detail";
import { handleFetch } from "@/lib/api";
import Header from "@/components/header";
import Banner from "@/components/banner";

export const Route = createFileRoute("/_auth/jobs")({
  head: () => ({
    meta: [
      { title: "Jobs - Job Bot" },
      { name: "description", content: "List of all the jobs the bot found" },
    ],
  }),
  loader: async () => {
    const [response, profileResponse] = await Promise.all([
      handleFetch({ path: "/jobs", method: "GET" }),
      handleFetch({ path: "/profile", method: "GET" }),
    ])

    // handleFetch returns null on a 404, meaning the profile hasn't been created yet.
    const hasProfile = profileResponse !== null

    if (!response) return { jobs: [], hasProfile }

    const result = await response.json()
    const parsedResult = jobsSchema.parse(result.data)

    return { jobs: parsedResult, hasProfile }
  },
  component: JobsRoute,
});

function JobsRoute() {
  const { jobs, hasProfile } = Route.useLoaderData();
  const drawerRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<Job | null>(null);

  const openJob = (job: Job) => {
    setSelected(job);
    const drawer = drawerRef.current;
    if (drawer && !drawer.open) drawer.showModal();
  };
  return (
    <>
      {!hasProfile && (
        <Banner
          icon={<TriangleAlert />}
          text={
            <>
              Your profile is incomplete.{" "}
              <Link to="/profile" className="text-accent hover:underline">
                Update your profile
              </Link>{" "}
              so the bot can tailor resumes and cover letters for you.
            </>
          }
        />
      )}

      <Header title="Jobs" />

      {jobs.length ? (
        <JobsTable jobs={jobs} selectedId={selected?.id} onOpen={openJob} />
      ) : (
        <div className="rounded-xl border border-dashed border-muted/20 px-6 py-16 text-center text-muted">
          <h2 className="mb-2 text-[1.25rem] text-text">No applications yet</h2>
          <p className="text-[0.9rem] opacity-70">
            Jobs will show up here as soon as the bot starts applying.
          </p>
        </div>
      )}

      <dialog
        id="job-drawer"
        ref={drawerRef}
        aria-labelledby="job-drawer-title"
        onClose={() => setSelected(null)}
        // The dialog has no padding, so a click whose target is the dialog itself landed on the backdrop.
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
        className="fixed inset-y-0 right-0 left-auto m-0 h-full max-h-none w-[min(500px,100vw)] max-w-[100vw] border-l border-muted/12 bg-bg p-0 text-text open:flex open:animate-drawer-in open:flex-col backdrop:animate-fade-in backdrop:bg-black/55 motion-reduce:open:animate-none motion-reduce:backdrop:animate-none"
      >
        <div className="flex justify-end px-3 pt-3">
          <button
            type="button"
            onClick={() => drawerRef.current?.close()}
          >
            <X />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-7 pt-1 pb-8">
          {selected && <JobDetail key={selected.id} job={selected} />}
        </div>
      </dialog>
    </>
  );
}
