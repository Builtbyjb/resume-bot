import { html } from "hono/html";
import AuthLayout from "../layouts/auth-layout";
import type { Job, JobArtifact, JobStatus, WorkMode } from "../types/job";
import {
    pageHeader,
    tableWrap,
    table,
    jobTitleCell,
    mutedCell,
    statusBadge,
    emptyState,
    drawer,
    drawerBar,
    drawerBody,
    iconButton,
    jobDetail,
    artifactList,
} from "../styles/style";

type Props = {
    jobs: Job[];
};

const statusLabels: Record<JobStatus, string> = {
    queued: "Queued",
    applied: "Applied",
    interviewing: "Interviewing",
    offer: "Offer",
    rejected: "Rejected",
    failed: "Failed",
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

const dateFormat = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
});

// Posting URLs come from scraped job boards, so only allow http(s) links.
function safeUrl(url: string) {
    try {
        const { protocol } = new URL(url);
        return protocol === "http:" || protocol === "https:" ? url : null;
    } catch {
        return null;
    }
}

function AppliedDate(date: Job["appliedAt"]) {
    if (!date) return html`<span class="${mutedCell}">—</span>`;
    return html`<time datetime="${date.toISOString()}">${dateFormat.format(date)}</time>`;
}

function StatusBadge(status: JobStatus) {
    return html`<span class="${statusBadge}" data-status="${status}"
        >${statusLabels[status]}</span
    >`;
}

function JobRow(job: Job) {
    return html`
        <tr data-job-id="${job.id}" tabindex="0" aria-haspopup="dialog" aria-controls="job-drawer">
            <td class="${jobTitleCell}">${job.title}</td>
            <td>${job.company}</td>
            <td>${AppliedDate(job.appliedAt)}</td>
            <td>${StatusBadge(job.status)}</td>
        </tr>
    `;
}

const fileIcon = html`<svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
</svg>`;

const downloadIcon = html`<svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
>
    <path d="M12 4v12" />
    <path d="m7 11 5 5 5-5" />
    <path d="M5 20h14" />
</svg>`;

function JobDetail(job: Job) {
    const postingUrl = safeUrl(job.postingUrl);

    return html`
        <template id="job-detail-${job.id}">
            <article class="${jobDetail}">
                <header>
                    <p>${job.company}</p>
                    <h2 id="job-drawer-title">${job.title}</h2>
                    ${StatusBadge(job.status)}
                </header>

                <section>
                    <h3>Details</h3>
                    <dl>
                        <dt>Applied</dt>
                        <dd>${AppliedDate(job.appliedAt)}</dd>
                        <dt>Location</dt>
                        <dd>${job.location} · ${workModeLabels[job.workMode]}</dd>
                        <dt>Salary</dt>
                        <dd>${job.salary ?? "Not listed"}</dd>
                        <dt>Source</dt>
                        <dd>${job.source}</dd>
                        <dt>Posting</dt>
                        <dd>
                            ${postingUrl
                                ? html`<a
                                      href="${postingUrl}"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      >View original posting ↗</a
                                  >`
                                : "Unavailable"}
                        </dd>
                    </dl>
                </section>

                <section>
                    <h3>Documents</h3>
                    ${job.artifacts.length
                        ? html`<ul class="${artifactList}">
                              ${job.artifacts.map(
                                  (artifact) => html`
                                      <li>
                                          <a href="${artifact.url}" download="${artifact.fileName}">
                                              ${fileIcon}
                                              <span>
                                                  <strong>${artifactLabels[artifact.kind]}</strong>
                                                  <small>${artifact.fileName}</small>
                                              </span>
                                              ${downloadIcon}
                                          </a>
                                      </li>
                                  `,
                              )}
                          </ul>`
                        : html`<p>No documents have been generated for this job yet.</p>`}
                </section>

                <section>
                    <h3>Description</h3>
                    <p>${job.description}</p>
                </section>
            </article>
        </template>
    `;
}

function JobsTable(jobs: Job[]) {
    if (!jobs.length) {
        return html`
            <div class="${emptyState}">
                <h2>No applications yet</h2>
                <p>Jobs will show up here as soon as the bot starts applying.</p>
            </div>
        `;
    }

    return html`
        <div class="${tableWrap}">
            <table class="${table}">
                <thead>
                    <tr>
                        <th scope="col">Job title</th>
                        <th scope="col">Company</th>
                        <th scope="col">Applied</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${jobs.map(JobRow)}
                </tbody>
            </table>
        </div>
        ${jobs.map(JobDetail)}
    `;
}

export default function JobsPage({ jobs }: Props) {
    return AuthLayout({
        title: "Jobs - Job Bot",
        description: "List of all the jobs the bot applied to",
        activePath: "/jobs",
        scriptPath: "/jobs.js",
        content: html`
            <header class="${pageHeader}">
                <h1>Jobs</h1>
                <p>${jobs.length} ${jobs.length === 1 ? "job" : "jobs"}</p>
            </header>

            ${JobsTable(jobs)}

            <dialog id="job-drawer" class="${drawer}" aria-labelledby="job-drawer-title">
                <div class="${drawerBar}">
                    <form method="dialog">
                        <button type="submit" class="${iconButton}" aria-label="Close details">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                aria-hidden="true"
                            >
                                <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </form>
                </div>
                <div class="${drawerBody}" data-drawer-body></div>
            </dialog>
        `,
    });
}
