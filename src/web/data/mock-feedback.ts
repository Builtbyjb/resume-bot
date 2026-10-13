import type { Feedback } from "../types/feedback";

export const mockFeedback: Feedback[] = [
    {
        id: "fb-3",
        type: "issue",
        title: "Cover letter download returns an error",
        description:
            "Clicking the cover letter link for the Stripe application shows a 404 page.\n\nExpected: the PDF downloads like the resume does.",
        status: "under_review",
        createdAt: new Date("2026-10-11T16:20:00Z"),
    },
    {
        id: "fb-2",
        type: "suggestion",
        title: "Filter jobs by status",
        description:
            "It would help to filter the jobs table to only show interviews and offers, especially once there are a lot of applications.",
        status: "planned",
        createdAt: new Date("2026-10-08T09:45:00Z"),
    },
    {
        id: "fb-1",
        type: "issue",
        title: "Timezone dropdown is hard to search",
        description: "Typing a city name in the timezone list doesn't jump to it.",
        status: "resolved",
        createdAt: new Date("2026-10-02T13:10:00Z"),
    },
];
