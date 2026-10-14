import type { NoticePeriod } from "@resume-bot/shared";
import { Field } from "@/components/ui/field";
import { withForm } from "@/lib/form";
import { fieldGridClass, ProfileSection } from "../components";
import { profileFormOptions } from "../profile-form";

const noticePeriodOptions: { value: NoticePeriod; label: string }[] = [
    { value: "immediately", label: "Available immediately" },
    { value: "1_week", label: "1 week" },
    { value: "2_weeks", label: "2 weeks" },
    { value: "1_month", label: "1 month" },
    { value: "2_months", label: "2 months" },
    { value: "3_months_plus", label: "3 months or more" },
];

const questions = [
    {
        name: "application.workAuthorized",
        label: "Are you legally authorized to work in the locations you're applying to?",
        required: true,
    },
    {
        name: "application.needsSponsorship",
        label: "Will you now or in the future require visa sponsorship?",
        required: true,
    },
    {
        name: "application.willingToRelocate",
        label: "Are you willing to relocate?",
        required: false,
    },
] as const;

export const ApplicationSection = withForm({
    ...profileFormOptions,
    render: function ApplicationSection({ form }) {
        return (
            <ProfileSection
                id="application"
                description="Answers to questions most application forms ask."
            >
                {questions.map((question) => {
                    const labelId = `${question.name.split(".")[1]}-label`;
                    return (
                        <form.AppField key={question.name} name={question.name}>
                            {(field) => (
                                <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                                    <span id={labelId} className="min-w-[14rem] flex-1 text-[0.9rem]">
                                        {question.label}
                                        {question.required && (
                                            <span className="text-warning"> *</span>
                                        )}
                                    </span>
                                    <field.YesNo labelId={labelId} />
                                </div>
                            )}
                        </form.AppField>
                    );
                })}
                <div className={fieldGridClass}>
                    <form.AppField name="application.noticePeriod">
                        {(field) => (
                            <field.SelectField label="Notice period" options={noticePeriodOptions} />
                        )}
                    </form.AppField>
                    <form.AppField name="application.earliestStart">
                        {(field) => (
                            <Field label="Earliest start date" hint="Optional.">
                                <field.DateInput />
                                <field.FieldError />
                            </Field>
                        )}
                    </form.AppField>
                </div>
            </ProfileSection>
        );
    },
});
