import { html } from "hono/html";
import AuthLayout from "../layouts/auth-layout";
import ComingSoon from "../component/coming-soon";
import {
    feedbackLimits,
    type Feedback,
    type FeedbackStatus,
    type FeedbackType,
} from "../types/feedback";
import {
    btn,
    btnPrimary,
    pageHeader,
    settingsCard,
    settingsLayout,
    settingLabel,
    radioList,
    cardBody,
    field,
    fieldInput,
    entryList,
    statusBadge,
    toast,
    formFooter,
    charCount,
    feedbackItem,
} from "../styles/style";

type Props = {
    feedback: Feedback[];
    initialType: FeedbackType;
};

const typeOptions: {
    value: FeedbackType;
    label: string;
    description: string;
    titlePlaceholder: string;
    descriptionPlaceholder: string;
}[] = [
    {
        value: "suggestion",
        label: "Suggestion",
        description: "An idea to make the app better.",
        titlePlaceholder: "e.g. Let me filter jobs by status",
        descriptionPlaceholder: "What would you like to see, and how would it help you?",
    },
    {
        value: "issue",
        label: "Report an issue",
        description: "Something is broken or not working as expected.",
        titlePlaceholder: "e.g. Cover letter download shows an error",
        descriptionPlaceholder:
            "What happened, and what did you expect instead? Steps to reproduce help a lot.",
    },
];

const typeLabels: Record<FeedbackType, string> = {
    suggestion: "Suggestion",
    issue: "Issue",
};

const statusLabels: Record<FeedbackStatus, string> = {
    new: "New",
    under_review: "Under review",
    planned: "Planned",
    resolved: "Resolved",
    closed: "Closed",
};

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });

/** Rendered on the server for history, and as a blank <template> the client fills after submitting. */
function FeedbackItem(item?: Feedback) {
    const status = item?.status ?? "new";
    return html`
        <details class="${feedbackItem}" data-feedback-item>
            <summary>
                <span>
                    <strong data-slot="title">${item?.title ?? ""}</strong>
                    <small>
                        <span data-slot="type">${item ? typeLabels[item.type] : ""}</span>
                        ·
                        <time data-slot="date" datetime="${item?.createdAt.toISOString() ?? ""}"
                            >${item ? dateFormat.format(item.createdAt) : ""}</time
                        >
                    </small>
                </span>
                <span class="${statusBadge}" data-status="${status}">${statusLabels[status]}</span>
            </summary>
            <p data-slot="description">${item?.description ?? ""}</p>
        </details>
    `;
}

function FeedbackForm(initialType: FeedbackType) {
    const initial = typeOptions.find((o) => o.value === initialType) ?? typeOptions[0];

    return html`
        <section class="${settingsCard}" aria-labelledby="feedback-form-title">
            <header>
                <h2 id="feedback-form-title">Send feedback</h2>
                <p>Suggestions and bug reports go straight to the team.</p>
            </header>
            <form id="feedback-form" class="${cardBody}" novalidate>
                <div class="${field}">
                    <span id="feedback-type-label">Type</span>
                    <div
                        class="${radioList}"
                        role="radiogroup"
                        aria-labelledby="feedback-type-label"
                        data-flush
                    >
                        ${typeOptions.map(
                            (option) => html`
                                <label>
                                    <input
                                        type="radio"
                                        name="type"
                                        value="${option.value}"
                                        data-label="${typeLabels[option.value]}"
                                        data-title-placeholder="${option.titlePlaceholder}"
                                        data-description-placeholder="${option.descriptionPlaceholder}"
                                        ${option.value === initial.value ? "checked" : ""}
                                        required
                                    />
                                    <span class="${settingLabel}">
                                        <strong>${option.label}</strong>
                                        <small>${option.description}</small>
                                    </span>
                                </label>
                            `,
                        )}
                    </div>
                </div>
                <label class="${field}">
                    <span>Title</span>
                    <input
                        type="text"
                        name="title"
                        class="${fieldInput}"
                        maxlength="${feedbackLimits.title.max}"
                        placeholder="${initial.titlePlaceholder}"
                        required
                    />
                </label>
                <label class="${field}">
                    <span>Description</span>
                    <textarea
                        name="description"
                        class="${fieldInput}"
                        rows="6"
                        minlength="${feedbackLimits.description.min}"
                        maxlength="${feedbackLimits.description.max}"
                        placeholder="${initial.descriptionPlaceholder}"
                        aria-describedby="feedback-char-count"
                        required
                    ></textarea>
                    <small id="feedback-char-count" class="${charCount}" data-char-count>
                        0 / ${feedbackLimits.description.max}
                    </small>
                </label>
                <div class="${formFooter}">
                    <small>Please don't include passwords or other sensitive information.</small>
                    <button type="submit" class="${btn} ${btnPrimary}">Send feedback</button>
                </div>
            </form>
        </section>
    `;
}

function FeedbackHistory(feedback: Feedback[]) {
    return html`
        <section class="${settingsCard}" aria-labelledby="feedback-history-title">
            <header>
                <h2 id="feedback-history-title">Your submissions</h2>
                <p>See what's happening with the feedback you've sent.</p>
            </header>
            <div class="${cardBody}">
                <div
                    class="${entryList}"
                    data-feedback-list
                    data-empty-text="You haven't sent any feedback yet."
                >
                    ${feedback.map((item) => FeedbackItem(item))}
                </div>
                <template data-feedback-template>${FeedbackItem()}</template>
            </div>
        </section>
    `;
}

export default function FeedbackPage({ feedback, initialType }: Props) {
    return AuthLayout({
        title: "Feedback - Job Bot",
        description: "Suggest improvements and report issues",
        activePath: "/feedback",
        scriptPath: "/feedback.js",
        content: html`
            <header class="${pageHeader}">
                <h1>Feedback</h1>
            </header>
            ${ComingSoon({
                feature: "feedback",
                title: "Feedback is coming soon",
                description:
                    "Soon you'll be able to send suggestions and report issues right here. Here's a preview.",
                content: html`<div class="${settingsLayout}">
                    ${FeedbackForm(initialType)} ${FeedbackHistory(feedback)}
                </div>`,
            })}
            <div class="${toast}" role="status" aria-live="polite" data-toast></div>
        `,
    });
}
