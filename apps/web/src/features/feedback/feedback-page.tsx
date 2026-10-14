import { useState } from "react";
import { revalidateLogic, useStore } from "@tanstack/react-form";
import {
    feedbackLimits,
    feedbackSchema,
    type Feedback,
    type FeedbackInput,
    type FeedbackStatus,
    type FeedbackType,
} from "@resume-bot/shared";
import { Button } from "@/components/ui/button";
import { Card, cardBodyClass, CardBody, PageHeader, stackClass } from "@/components/ui/card";
import { ComingSoon } from "@/components/ui/coming-soon";
import { Field, FieldLabel } from "@/components/ui/field";
import { StatusBadge, type BadgeTone } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast-context";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { api, ApiError } from "@/lib/api";
import { cx } from "@/lib/cx";
import { useAppForm } from "@/lib/form";
import { mediumDate } from "@/lib/format";

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

const statuses: Record<FeedbackStatus, { label: string; tone: BadgeTone }> = {
    new: { label: "New", tone: "amber" },
    under_review: { label: "Under review", tone: "blue" },
    planned: { label: "Planned", tone: "violet" },
    resolved: { label: "Resolved", tone: "green" },
    closed: { label: "Closed", tone: "idle" },
};

export function FeedbackPage({ feedback, initialType }: Props) {
    const [history, setHistory] = useState(feedback);

    return (
        <>
            <PageHeader title="Feedback" />
            <ComingSoon
                feature="feedback"
                title="Feedback is coming soon"
                description="Soon you'll be able to send suggestions and report issues right here. Here's a preview."
            >
                <div className={stackClass}>
                    <FeedbackForm
                        initialType={initialType}
                        onSent={(item) => setHistory((items) => [item, ...items])}
                    />
                    <FeedbackHistory feedback={history} />
                </div>
            </ComingSoon>
        </>
    );
}

function FeedbackForm({
    initialType,
    onSent,
}: {
    initialType: FeedbackType;
    onSent: (item: Feedback) => void;
}) {
    const showToast = useToast();

    const form = useAppForm({
        defaultValues: { type: initialType, title: "", description: "" } as FeedbackInput,
        validationLogic: revalidateLogic(),
        validators: { onDynamic: feedbackSchema },
        onSubmit: async ({ value, formApi }) => {
            const input = { ...value, title: value.title.trim(), description: value.description.trim() };
            try {
                const created = await api<Partial<Feedback> & { createdAt?: string }>("/feedback", {
                    method: "POST",
                    body: input,
                });
                onSent({
                    id: crypto.randomUUID(),
                    status: "new",
                    ...input,
                    ...created,
                    createdAt: created?.createdAt ? new Date(created.createdAt) : new Date(),
                });
                formApi.reset({ type: value.type, title: "", description: "" });
                showToast("Thanks! Your feedback was sent.");
            } catch (error) {
                showToast(
                    error instanceof ApiError && error.status === 429
                        ? "You're sending feedback too quickly. Please wait a minute and try again."
                        : "Couldn't send your feedback. Please try again.",
                    "error",
                );
            }
        },
    });

    const type = useStore(form.store, (state) => state.values.type);
    const hasDraft = useStore(form.store, (state) =>
        Boolean(state.values.title.trim() || state.values.description.trim()),
    );
    useUnsavedChanges(hasDraft);
    const selected = typeOptions.find((option) => option.value === type) ?? typeOptions[0];

    return (
        <Card
            title="Send feedback"
            titleId="feedback-form-title"
            description="Suggestions and bug reports go straight to the team."
        >
            <form
                noValidate
                className={cardBodyClass}
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void form.handleSubmit();
                }}
            >
                <div className="flex min-w-0 flex-col gap-[0.35rem]">
                    <FieldLabel id="feedback-type-label">Type</FieldLabel>
                    <form.AppField name="type">
                        {(field) => (
                            <field.RadioCards
                                labelId="feedback-type-label"
                                options={typeOptions}
                                flush
                            />
                        )}
                    </form.AppField>
                </div>
                <form.AppField name="title">
                    {(field) => (
                        <field.TextField
                            label="Title"
                            required
                            maxLength={feedbackLimits.title.max}
                            placeholder={selected.titlePlaceholder}
                        />
                    )}
                </form.AppField>
                <form.AppField name="description">
                    {(field) => {
                        const length = field.state.value.length;
                        const max = feedbackLimits.description.max;
                        return (
                            <Field label="Description" required>
                                <field.TextArea
                                    rows={6}
                                    maxLength={max}
                                    placeholder={selected.descriptionPlaceholder}
                                    aria-describedby="feedback-char-count"
                                />
                                <field.FieldError />
                                <small
                                    id="feedback-char-count"
                                    className={cx(
                                        "self-end text-[0.75rem] leading-normal",
                                        length >= max * 0.9
                                            ? "text-warning"
                                            : "text-muted opacity-60",
                                    )}
                                >
                                    {length} / {max}
                                </small>
                            </Field>
                        );
                    }}
                </form.AppField>
                <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                    <small className="text-[0.75rem] text-muted opacity-60">
                        Please don't include passwords or other sensitive information.
                    </small>
                    <form.Subscribe selector={(state) => state.isSubmitting}>
                        {(isSubmitting) => (
                            <Button type="submit" variant="primary" disabled={isSubmitting}>
                                {isSubmitting ? "Sending…" : "Send feedback"}
                            </Button>
                        )}
                    </form.Subscribe>
                </div>
            </form>
        </Card>
    );
}

function FeedbackHistory({ feedback }: { feedback: Feedback[] }) {
    return (
        <Card
            title="Your submissions"
            titleId="feedback-history-title"
            description="See what's happening with the feedback you've sent."
        >
            <CardBody>
                <div className="flex flex-col gap-3">
                    {feedback.length ? (
                        feedback.map((item) => <FeedbackItem key={item.id} item={item} />)
                    ) : (
                        <div className="rounded-xl border border-dashed border-muted/18 p-5 text-center text-[0.85rem] text-muted opacity-70">
                            You haven't sent any feedback yet.
                        </div>
                    )}
                </div>
            </CardBody>
        </Card>
    );
}

function FeedbackItem({ item }: { item: Feedback }) {
    const status = statuses[item.status];
    return (
        <details className="group rounded-xl border border-muted/12 transition-[border-color] duration-150 open:border-muted/22">
            <summary className="flex cursor-pointer list-none items-center gap-4 rounded-[inherit] px-[1.1rem] py-[0.9rem] before:size-[7px] before:shrink-0 before:-rotate-45 before:border-r-[1.5px] before:border-b-[1.5px] before:border-muted before:opacity-60 before:transition-transform before:duration-150 before:content-[''] group-open:before:rotate-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
                <span className="flex min-w-0 flex-1 flex-col gap-[0.15rem]">
                    <strong className="truncate text-[0.95rem] font-normal">{item.title}</strong>
                    <small className="text-[0.75rem] text-muted opacity-65">
                        {typeLabels[item.type]} ·{" "}
                        <time dateTime={item.createdAt.toISOString()}>
                            {mediumDate.format(item.createdAt)}
                        </time>
                    </small>
                </span>
                <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
            </summary>
            <p className="px-[1.1rem] pb-4 pl-[2.6rem] text-[0.875rem] whitespace-pre-line text-muted wrap-anywhere">
                {item.description}
            </p>
        </details>
    );
}
