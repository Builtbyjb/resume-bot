import type { CoverLetterTone } from "@resume-bot/shared";
import { FieldLabel } from "@/components/ui/field";
import { withForm } from "@/lib/form";
import { ProfileSection } from "../components";
import { profileFormOptions } from "../profile-form";

const toneOptions: { value: CoverLetterTone; label: string; description: string }[] = [
    { value: "professional", label: "Professional", description: "Polished and formal." },
    { value: "friendly", label: "Friendly", description: "Warm and conversational." },
    {
        value: "enthusiastic",
        label: "Enthusiastic",
        description: "Shows real excitement for the role.",
    },
    { value: "concise", label: "Concise", description: "Short and to the point." },
];

export const WritingSection = withForm({
    ...profileFormOptions,
    render: function WritingSection({ form }) {
        return (
            <ProfileSection
                id="writing"
                description="Guide how the AI writes your resumes and cover letters."
            >
                <div className="flex min-w-0 flex-col gap-[0.35rem]">
                    <FieldLabel id="tone-label">Cover letter tone</FieldLabel>
                    <form.AppField name="writing.tone">
                        {(field) => (
                            <field.RadioCards labelId="tone-label" options={toneOptions} flush />
                        )}
                    </form.AppField>
                </div>
                <form.AppField name="writing.instructions">
                    {(field) => (
                        <field.TextAreaField
                            label="Extra instructions"
                            hint="Anything the AI should emphasize or avoid in every application."
                            rows={4}
                            maxLength={2000}
                            placeholder="e.g. Highlight my open-source work. Don't mention my freelance years."
                        />
                    )}
                </form.AppField>
            </ProfileSection>
        );
    },
});
