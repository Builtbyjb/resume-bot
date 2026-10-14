import { useRef, useState } from "react";
import type { Job, JobArtifact, JobStatus, WorkMode } from "@resume-bot/shared";
import { PageHeader } from "@/components/ui/card";
import { CloseIcon, DownloadIcon, FileIcon } from "@/components/ui/icons";
import { StatusBadge, type BadgeTone } from "@/components/ui/status-badge";
import { subheadingClass } from "@/components/ui/styles";
import { cx } from "@/lib/cx";
import { mediumDate, safeUrl } from "@/lib/format";

const statuses: Record<JobStatus, { label: string; tone: BadgeTone }> = {
    queued: { label: "Queued", tone: "idle" },
    applied: { label: "Applied", tone: "blue" },
    interviewing: { label: "Interviewing", tone: "violet" },
    offer: { label: "Offer", tone: "green" },
    rejected: { label: "Rejected", tone: "red" },
    failed: { label: "Failed", tone: "orange" },
};

const workModeLabels: Record<WorkMode, string> = {
    remote: "Remote",
    hybrid: "Hybrid",
    onsite: "On-site",
};

const artifactLabels: Record<JobArtifact["kind"], string> = {
    resume: "Tailored resume",
    cover_letter: "Cover letter",
};

function JobStatusBadge({ status }: { status: JobStatus }) {
    const { label, tone } = statuses[status];
    return <StatusBadge tone={tone}>{label}</StatusBadge>;
}

function AppliedDate({ date }: { date: Job["appliedAt"] }) {
    if (!date) return <span className="text-muted opacity-75">—</span>;
    return <time dateTime={date.toISOString()}>{mediumDate.format(date)}</time>;
}

export function JobsPage({ jobs }: { jobs: Job[] }) {
    const drawerRef = useRef<HTMLDialogElement>(null);
    const [selected, setSelected] = useState<Job | null>(null);

    const openJob = (job: Job) => {
        setSelected(job);
        const drawer = drawerRef.current;
        if (drawer && !drawer.open) drawer.showModal();
    };

    return (
        <>
            <PageHeader title="Jobs" />

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
                        aria-label="Close details"
                        onClick={() => drawerRef.current?.close()}
                        className="inline-flex size-9 cursor-pointer items-center justify-center rounded-[10px] bg-transparent text-muted transition-[background-color,color] duration-150 hover:bg-muted/8 hover:text-text focus-visible:bg-muted/8 focus-visible:text-text focus-visible:outline-none [&_svg]:size-[18px]"
                    >
                        <CloseIcon />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-7 pt-1 pb-8">
                    {selected && <JobDetail key={selected.id} job={selected} />}
                </div>
            </dialog>
        </>
    );
}

const thClass =
    "border-b border-muted/12 px-[1.1rem] py-[0.8rem] text-left text-[0.75rem] font-normal tracking-[0.06em] whitespace-nowrap text-muted uppercase opacity-70";
const tdClass = "border-b border-muted/8 px-[1.1rem] py-[0.95rem] whitespace-nowrap";

function JobsTable({
    jobs,
    selectedId,
    onOpen,
}: {
    jobs: Job[];
    selectedId?: string;
    onOpen: (job: Job) => void;
}) {
    return (
        <div className="overflow-x-auto rounded-xl border border-muted/12">
            <table className="w-full border-collapse text-[0.9rem]">
                <thead>
                    <tr>
                        <th scope="col" className={thClass}>
                            Job title
                        </th>
                        <th scope="col" className={thClass}>
                            Company
                        </th>
                        <th scope="col" className={thClass}>
                            Applied
                        </th>
                        <th scope="col" className={thClass}>
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.map((job) => (
                        <tr
                            key={job.id}
                            tabIndex={0}
                            aria-haspopup="dialog"
                            aria-controls="job-drawer"
                            onClick={() => onOpen(job)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    onOpen(job);
                                }
                            }}
                            className={cx(
                                "cursor-pointer outline-none transition-[background-color] duration-150 [&:last-child>td]:border-b-0",
                                job.id === selectedId
                                    ? "bg-accent/12 shadow-[inset_2px_0_0_var(--color-accent)]"
                                    : "hover:bg-muted/5 focus-visible:bg-muted/5 focus-visible:shadow-[inset_2px_0_0_var(--color-accent)]",
                            )}
                        >
                            <td className={`${tdClass} font-grotesk text-[0.975rem] font-medium`}>
                                {job.title}
                            </td>
                            <td className={tdClass}>{job.company}</td>
                            <td className={tdClass}>
                                <AppliedDate date={job.appliedAt} />
                            </td>
                            <td className={tdClass}>
                                <JobStatusBadge status={job.status} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function JobDetail({ job }: { job: Job }) {
    const postingUrl = safeUrl(job.postingUrl);
    const sectionTitle = `${subheadingClass} mb-3`;

    return (
        <article className="flex flex-col gap-7">
            <header className="flex flex-col items-start gap-2">
                <p className="text-[0.9rem] text-muted opacity-75">{job.company}</p>
                <h2 id="job-drawer-title" className="text-[1.6rem]">
                    {job.title}
                </h2>
                <JobStatusBadge status={job.status} />
            </header>

            <section>
                <h3 className={sectionTitle}>Details</h3>
                <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-[0.6rem] text-[0.9rem] [&_dt]:text-muted [&_dt]:opacity-70">
                    <dt>Applied</dt>
                    <dd>
                        <AppliedDate date={job.appliedAt} />
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
                                    <FileIcon />
                                    <span className="flex min-w-0 flex-1 flex-col">
                                        <strong className="text-[0.9rem] font-normal">
                                            {artifactLabels[artifact.kind]}
                                        </strong>
                                        <small className="truncate text-[0.75rem] text-muted opacity-60">
                                            {artifact.fileName}
                                        </small>
                                    </span>
                                    <DownloadIcon />
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
