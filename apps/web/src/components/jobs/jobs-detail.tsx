import type { JobStatus, Job, WorkMode, JobArtifact } from "@resume-bot/shared";
import { mediumDate, safeUrl } from "@/lib/format";

const workModeLabels: Record<WorkMode, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "On-site",
};

const artifactLabels: Record<JobArtifact["kind"], string> = {
  resume: "Tailored resume",
  cover_letter: "Cover letter",
};


const statuses: Record<JobStatus, { label: string; tone: BadgeTone }> = {
  queued: { label: "Queued", tone: "idle" },
  applied: { label: "Applied", tone: "blue" },
  interviewing: { label: "Interviewing", tone: "violet" },
  offer: { label: "Offer", tone: "green" },
  rejected: { label: "Rejected", tone: "red" },
  failed: { label: "Failed", tone: "orange" },
};

export default function JobDetail({ job }: { job: Job }) {
  const postingUrl = safeUrl(job.postingUrl);
  const sectionTitle = `mb-3`;

  return (
    <article className="flex flex-col gap-7">
      <header className="flex flex-col items-start gap-2">
        <p className="text-[0.9rem] text-muted opacity-75">{job.company}</p>
        <h2 id="job-drawer-title" className="text-[1.6rem]">
          {job.title}
        </h2>
        {/*<JobStatusBadge status={job.status} />*/}
      </header>

      <section>
        <h3 className={sectionTitle}>Details</h3>
        <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-[0.6rem] text-[0.9rem] [&_dt]:text-muted [&_dt]:opacity-70">
          <dt>Applied</dt>
          <dd>
            {/*<AppliedDate date={job.appliedAt} />*/}
          </dd>
          <dt>Location</dt>
          <dd>
            {job.location} · {workModeLabels[job.workMode]}
          </dd>
          <dt>Salary</dt>
          <dd>{job.salary ?? "Not listed"}</dd>
          <dt>Source</dt>
          <dd>{job.source}</dd>
          <dt>Posting</dt>
          <dd>
            {postingUrl ? (
              <a
                href={postingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                View original posting ↗
              </a>
            ) : (
              "Unavailable"
            )}
          </dd>
        </dl>
      </section>

      <section>
        <h3 className={sectionTitle}>Documents</h3>
        {job.artifacts.length ? (
          <ul className="flex flex-col gap-[0.6rem]">
            {job.artifacts.map((artifact) => (
              <li key={artifact.kind}>
                <a
                  href={artifact.url}
                  download={artifact.fileName}
                  className="flex items-center gap-[0.9rem] rounded-xl border border-muted/12 px-4 py-[0.8rem] transition-[border-color,background-color] duration-150 hover:border-accent hover:bg-accent/8 focus-visible:border-accent focus-visible:bg-accent/8 focus-visible:outline-none [&_svg]:size-5 [&_svg]:shrink-0 [&_svg]:text-muted"
                >
                  {/*<FileIcon />*/}
                  <span className="flex min-w-0 flex-1 flex-col">
                    <strong className="text-[0.9rem] font-normal">
                      {artifactLabels[artifact.kind]}
                    </strong>
                    <small className="truncate text-[0.75rem] text-muted opacity-60">
                      {artifact.fileName}
                    </small>
                  </span>
                  {/*<DownloadIcon />*/}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[0.9rem] whitespace-pre-line text-muted">
            No documents have been generated for this job yet.
          </p>
        )}
      </section>

      <section>
        <h3 className={sectionTitle}>Description</h3>
        <p className="text-[0.9rem] whitespace-pre-line text-muted">{job.description}</p>
      </section>
    </article>
  );
}
