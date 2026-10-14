import type { JobBoard, WorkMode } from "@resume-bot/shared";
import { FieldLabel, GroupField, Hint } from "@/components/ui/field";
import { withForm } from "@/lib/form";
import { ProfileSection } from "../components";
import { profileFormOptions } from "../profile-form";

const workModeOptions: { value: WorkMode; label: string }[] = [
    { value: "remote", label: "Remote" },
    { value: "hybrid", label: "Hybrid" },
    { value: "onsite", label: "On-site" },
];

const jobBoardOptions: { value: JobBoard; label: string }[] = [
    { value: "linkedin", label: "LinkedIn" },
    { value: "indeed", label: "Indeed" },
    { value: "glassdoor", label: "Glassdoor" },
    { value: "wellfound", label: "Wellfound" },
    { value: "hacker_news", label: "Hacker News" },
    { value: "company_sites", label: "Company career pages" },
];

const currencyOptions = Intl.supportedValuesOf("currency").map((code) => ({
    value: code,
    label: code,
}));

const periodOptions = [
    { value: "year", label: "year" },
    { value: "hour", label: "hour" },
];

export const PreferencesSection = withForm({
    ...profileFormOptions,
    render: function PreferencesSection({ form }) {
        return (
            <ProfileSection
                id="preferences"
                description="What the bot searches for. Jobs outside these preferences are skipped."
            >
                <form.AppField name="preferences.titles">
                    {(field) => (
                        <GroupField labelId="titles-label" label="Target job titles" required>
                            <field.TagInput
                                labelId="titles-label"
                                placeholder="e.g. Frontend Engineer"
                            />
                            <field.FieldError />
                        </GroupField>
                    )}
                </form.AppField>
                <form.AppField name="preferences.locations">
                    {(field) => (
                        <GroupField
                            labelId="locations-label"
                            label="Locations"
                            required
                            hint="Cities, regions, or “Remote (US)”."
                        >
                            <field.TagInput
                                labelId="locations-label"
                                placeholder="e.g. Berlin, Germany"
                            />
                            <field.FieldError />
                        </GroupField>
                    )}
                </form.AppField>
                <form.AppField name="preferences.workModes">
                    {(field) => (
                        <GroupField labelId="workModes-label" label="Work arrangement" required>
                            <field.ChipGroup labelId="workModes-label" options={workModeOptions} />
                            <field.FieldError />
                        </GroupField>
                    )}
                </form.AppField>
                <div className="flex min-w-0 flex-col gap-[0.35rem]">
                    <FieldLabel id="minSalary-label">Minimum salary</FieldLabel>
                    <div
                        role="group"
                        aria-labelledby="minSalary-label"
                        className="flex flex-wrap items-center gap-2 text-[0.85rem] text-muted"
                    >
                        <form.AppField name="preferences.minSalary.amount">
                            {(field) => (
                                <field.NumberInput
                                    nullable
                                    min={0}
                                    step={1000}
                                    placeholder="Any"
                                    aria-label="Amount"
                                />
                            )}
                        </form.AppField>
                        <form.AppField name="preferences.minSalary.currency">
                            {(field) => (
                                <field.Select aria-label="Currency" options={currencyOptions} />
                            )}
                        </form.AppField>
                        <span>per</span>
                        <form.AppField name="preferences.minSalary.period">
                            {(field) => <field.Select aria-label="Period" options={periodOptions} />}
                        </form.AppField>
                    </div>
                    <form.AppField name="preferences.minSalary.amount">
                        {(field) => <field.FieldError />}
                    </form.AppField>
                    <Hint>Jobs that list a lower salary are skipped. Leave empty to allow any.</Hint>
                </div>
                <form.AppField name="preferences.excludedCompanies">
                    {(field) => (
                        <GroupField
                            labelId="excludedCompanies-label"
                            label="Excluded companies"
                            hint="The bot never applies to these, e.g. your current employer."
                        >
                            <field.TagInput
                                labelId="excludedCompanies-label"
                                placeholder="Company name"
                            />
                        </GroupField>
                    )}
                </form.AppField>
                <form.AppField name="preferences.jobBoards">
                    {(field) => (
                        <GroupField
                            labelId="jobBoards-label"
                            label="Job boards to search"
                            hint="Leave all unselected to search every supported board."
                        >
                            <field.ChipGroup labelId="jobBoards-label" options={jobBoardOptions} />
                        </GroupField>
                    )}
                </form.AppField>
            </ProfileSection>
        );
    },
});
