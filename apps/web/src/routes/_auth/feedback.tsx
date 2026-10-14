import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod";
import { mockFeedback } from "@/data/mock-feedback";
import { FeedbackPage } from "@/features/feedback/feedback-page";

// `?type=issue` preselects "Report an issue", so other pages can link straight to a bug report.
const searchSchema = z.object({
    type: z.enum(["suggestion", "issue"]).optional().catch(undefined),
});

export const Route = createFileRoute("/_auth/feedback")({
    validateSearch: searchSchema,
    head: () => ({
        meta: [
            { title: "Feedback - Job Bot" },
            { name: "description", content: "Suggest improvements and report issues" },
        ],
    }),
    // TODO: replace with the user's feedback from the API once the feedback endpoints exist
    loader: () => ({ feedback: mockFeedback }),
    component: FeedbackRoute,
});

function FeedbackRoute() {
    const { feedback } = Route.useLoaderData();
    const { type } = Route.useSearch();
    return <FeedbackPage feedback={feedback} initialType={type ?? "suggestion"} />;
}
