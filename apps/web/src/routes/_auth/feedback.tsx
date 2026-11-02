import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod";

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
  // loader: () => ({ feedback: mockFeedback }),
  component: FeedbackRoute,
});

function FeedbackRoute() {
  return <h1>Feedback</h1>;
}
