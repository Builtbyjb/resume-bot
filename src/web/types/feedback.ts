export type FeedbackType = "suggestion" | "issue";

export type FeedbackStatus = "new" | "under_review" | "planned" | "resolved" | "closed";

export type Feedback = {
    id: string;
    type: FeedbackType;
    title: string;
    description: string;
    status: FeedbackStatus;
    createdAt: Date;
};

// Meant to back the API's zod schema later.
export const feedbackLimits = {
    title: { max: 120 },
    description: { min: 10, max: 5000 },
};
