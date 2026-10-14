import { withForm } from "@/lib/form";
import { ProfileSection } from "../components";
import { profileFormOptions } from "../profile-form";

export const SummarySection = withForm({
    ...profileFormOptions,
    render: function SummarySection({ form }) {
        return (
            <ProfileSection id="summary" description="The AI adapts these to each job description.">
                <form.AppField name="headline">
                    {(field) => (
                        <field.TextField
                            label="Headline"
                            required
                            hint="One line, e.g. “Backend engineer specializing in payments”."
                            maxLength={120}
                        />
                    )}
                </form.AppField>
                <form.AppField name="summary">
                    {(field) => (
                        <field.TextAreaField
                            label="Professional summary"
                            required
                            hint="A few sentences about your experience, strengths and what you're looking for."
                            rows={5}
                            maxLength={1500}
                        />
                    )}
                </form.AppField>
            </ProfileSection>
        );
    },
});
