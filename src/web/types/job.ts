export type JobStatus =
    | "queued"
    | "applied"
    | "interviewing"
    | "offer"
    | "rejected"
    | "failed";

export type WorkMode = "remote" | "hybrid" | "onsite";

export type JobArtifact = {
    kind: "resume" | "cover_letter";
    fileName: string;
    url: string;
};

export type Job = {
    id: string;
    title: string;
    company: string;
    /** null when the bot hasn't submitted the application (queued / failed) */
    appliedAt: Date | null;
    status: JobStatus;
    postingUrl: string;
    location: string;
    workMode: WorkMode;
    /** Free text as listed on the posting, e.g. "$120k – $150k / year" */
    salary: string | null;
    source: string;
    description: string;
    artifacts: JobArtifact[];
};
