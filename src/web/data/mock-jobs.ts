import type { Job, JobArtifact } from "../types/job";

const artifacts = (id: string, slug: string): JobArtifact[] => [
    {
        kind: "resume",
        fileName: `resume-${slug}.pdf`,
        url: `/api/v1/jobs/${id}/artifacts/resume`,
    },
    {
        kind: "cover_letter",
        fileName: `cover-letter-${slug}.pdf`,
        url: `/api/v1/jobs/${id}/artifacts/cover_letter`,
    },
];

export const mockJobs: Job[] = [
    {
        id: "a1f4c2d0-0001-4e7a-9b1a-000000000001",
        title: "Senior Frontend Engineer",
        company: "Linear",
        appliedAt: new Date("2026-10-10T14:22:00Z"),
        status: "interviewing",
        postingUrl: "https://linear.app/careers",
        location: "San Francisco, CA",
        workMode: "remote",
        salary: "$170k – $210k / year",
        source: "LinkedIn",
        description:
            "We're looking for a senior frontend engineer to help build the fastest issue tracker in the world.\n\nYou'll work closely with design to ship polished, performant interfaces in React and TypeScript, and own features end to end.",
        artifacts: artifacts("a1f4c2d0-0001-4e7a-9b1a-000000000001", "linear"),
    },
    {
        id: "a1f4c2d0-0002-4e7a-9b1a-000000000002",
        title: "Full Stack Developer",
        company: "Vercel",
        appliedAt: new Date("2026-10-09T09:05:00Z"),
        status: "applied",
        postingUrl: "https://vercel.com/careers",
        location: "New York, NY",
        workMode: "hybrid",
        salary: "$150k – $185k / year",
        source: "Company site",
        description:
            "Join the team building the frontend cloud. You'll work across Next.js, edge infrastructure and the Vercel dashboard.",
        artifacts: artifacts("a1f4c2d0-0002-4e7a-9b1a-000000000002", "vercel"),
    },
    {
        id: "a1f4c2d0-0003-4e7a-9b1a-000000000003",
        title: "Software Engineer, Workers",
        company: "Cloudflare",
        appliedAt: new Date("2026-10-07T17:40:00Z"),
        status: "offer",
        postingUrl: "https://www.cloudflare.com/careers/",
        location: "Austin, TX",
        workMode: "onsite",
        salary: "$160k – $200k / year",
        source: "Indeed",
        description:
            "Help build the Workers runtime and developer platform used by millions of developers. Experience with V8, Rust or distributed systems is a plus.",
        artifacts: artifacts("a1f4c2d0-0003-4e7a-9b1a-000000000003", "cloudflare"),
    },
    {
        id: "a1f4c2d0-0004-4e7a-9b1a-000000000004",
        title: "Backend Engineer",
        company: "Stripe",
        appliedAt: new Date("2026-10-03T11:15:00Z"),
        status: "rejected",
        postingUrl: "https://stripe.com/jobs",
        location: "Seattle, WA",
        workMode: "hybrid",
        salary: null,
        source: "LinkedIn",
        description:
            "Design and build the APIs that move money on the internet. You'll work on reliability, scalability and developer experience.",
        artifacts: artifacts("a1f4c2d0-0004-4e7a-9b1a-000000000004", "stripe"),
    },
    {
        id: "a1f4c2d0-0005-4e7a-9b1a-000000000005",
        title: "Platform Engineer",
        company: "Fly.io",
        appliedAt: null,
        status: "failed",
        postingUrl: "https://fly.io/jobs/",
        location: "Anywhere",
        workMode: "remote",
        salary: "$140k – $180k / year",
        source: "Hacker News",
        description:
            "Work on the platform that runs full-stack apps close to users. Strong Linux and networking fundamentals required.",
        artifacts: [],
    },
    {
        id: "a1f4c2d0-0006-4e7a-9b1a-000000000006",
        title: "Product Engineer",
        company: "Raycast",
        appliedAt: null,
        status: "queued",
        postingUrl: "https://www.raycast.com/jobs",
        location: "London, UK",
        workMode: "remote",
        salary: "£90k – £120k / year",
        source: "Wellfound",
        description:
            "Build productivity tools loved by developers. You'll ship features across the macOS app, extensions API and store.",
        artifacts: [],
    },
];
