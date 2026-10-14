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

export const feedbackLimits = {
    title: { max: 120 },
    description: { min: 10, max: 5000 },
};
