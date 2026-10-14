import { Field } from "@/components/ui/field";
import { fieldInputClass, subheadingClass } from "@/components/ui/styles";
import { withForm } from "@/lib/form";
import { fieldGridClass, ProfileSection } from "../components";
import { profileFormOptions } from "../profile-form";

export const PersonalSection = withForm({
    ...profileFormOptions,
    props: { email: "" },
    render: function PersonalSection({ form, email }) {
        return (
            <ProfileSection
                id="personal"
                description="Shown at the top of every resume and cover letter."
            >
                <div className={fieldGridClass}>
                    <form.AppField name="firstName">
                        {(field) => <field.TextField label="First name" required maxLength={60} />}
                    </form.AppField>
                    <form.AppField name="lastName">
                        {(field) => <field.TextField label="Last name" required maxLength={60} />}
                    </form.AppField>
                    <Field
                        label="Email"
                        hint="Your sign-in email. Used as the contact address on applications."
                    >
                        <input type="email" className={fieldInputClass} value={email} readOnly />
                    </Field>
                    <form.AppField name="phone">
                        {(field) => (
                            <field.TextField label="Phone" required type="tel" maxLength={30} />
                        )}
                    </form.AppField>
                    <form.AppField name="location">
                        {(field) => (
                            <field.TextField
                                label="Location"
                                required
                                full
                                hint="City and country/state. Recruiters use this to check time zones and eligibility."
                                maxLength={120}
                            />
                        )}
                    </form.AppField>
                </div>
                <h3 className={subheadingClass}>Links</h3>
                <div className={fieldGridClass}>
                    <form.AppField name="links.linkedin">
                        {(field) => (
                            <field.TextField
                                label="LinkedIn"
                                type="url"
                                placeholder="https://www.linkedin.com/in/…"
                            />
                        )}
                    </form.AppField>
                    <form.AppField name="links.github">
                        {(field) => (
                            <field.TextField
                                label="GitHub"
                                type="url"
                                placeholder="https://github.com/…"
                            />
                        )}
                    </form.AppField>
                    <form.AppField name="links.portfolio">
                        {(field) => (
                            <field.TextField
                                label="Portfolio / website"
                                type="url"
                                placeholder="https://"
                            />
                        )}
                    </form.AppField>
                </div>
            </ProfileSection>
        );
    },
});
