import { Field } from "@/components/ui/field";
import { withForm } from "@/lib/form";
import {
    AddButton,
    dateRangeClass,
    EntryCard,
    EntryFooter,
    EntryList,
    fieldGridClass,
    ProfileSection,
    RemoveButton,
} from "../components";
import { newExperience, profileFormOptions } from "../profile-form";
import { useEntryList } from "../use-entry-list";

export const ExperienceSection = withForm({
    ...profileFormOptions,
    render: function ExperienceSection({ form }) {
        const list = useEntryList();

        return (
            <ProfileSection
                id="experience"
                description="Most recent first. Achievements with numbers make the strongest resumes."
            >
                <form.Field name="experience" mode="array">
                    {(experience) => (
                        <>
                            <EntryList emptyText="No experience added yet.">
                                {experience.state.value.map((entry, i) => (
                                    <EntryCard key={entry.id}>
                                        <div className={fieldGridClass}>
                                            <form.AppField name={`experience[${i}].title`}>
                                                {(field) => (
                                                    <field.TextField
                                                        label="Job title"
                                                        required
                                                        maxLength={120}
                                                        autoFocus={list.isNew(entry.id)}
                                                    />
                                                )}
                                            </form.AppField>
                                            <form.AppField name={`experience[${i}].company`}>
                                                {(field) => (
                                                    <field.TextField
                                                        label="Company"
                                                        required
                                                        maxLength={120}
                                                    />
                                                )}
                                            </form.AppField>
                                            <form.AppField name={`experience[${i}].location`}>
                                                {(field) => (
                                                    <field.TextField
                                                        label="Location"
                                                        placeholder="City, country or Remote"
                                                        maxLength={120}
                                                    />
                                                )}
                                            </form.AppField>
                                            <div className={dateRangeClass}>
                                                <form.AppField name={`experience[${i}].startDate`}>
                                                    {(field) => (
                                                        <field.MonthField label="Start" required />
                                                    )}
                                                </form.AppField>
                                                <form.Subscribe
                                                    selector={(state) =>
                                                        state.values.experience[i]?.current ?? false
                                                    }
                                                >
                                                    {(current) => (
                                                        <form.AppField
                                                            name={`experience[${i}].endDate`}
                                                        >
                                                            {(field) => (
                                                                <field.MonthField
                                                                    label="End"
                                                                    disabled={current}
                                                                />
                                                            )}
                                                        </form.AppField>
                                                    )}
                                                </form.Subscribe>
                                            </div>
                                            <form.AppField name={`experience[${i}].achievements`}>
                                                {(field) => (
                                                    <Field
                                                        label="Key achievements"
                                                        full
                                                        hint="One per line. The AI picks the most relevant ones for each job."
                                                    >
                                                        <field.LinesTextArea
                                                            rows={4}
                                                            maxLength={3000}
                                                        />
                                                    </Field>
                                                )}
                                            </form.AppField>
                                        </div>
                                        <EntryFooter>
                                            <form.AppField name={`experience[${i}].current`}>
                                                {(field) => (
                                                    <field.Checkbox>I currently work here</field.Checkbox>
                                                )}
                                            </form.AppField>
                                            <RemoveButton
                                                aria-label="Remove this experience"
                                                onClick={() => {
                                                    experience.removeValue(i);
                                                    list.removed();
                                                }}
                                            />
                                        </EntryFooter>
                                    </EntryCard>
                                ))}
                            </EntryList>
                            <AddButton
                                ref={list.addButtonRef}
                                onClick={() => {
                                    const entry = newExperience();
                                    experience.pushValue(entry);
                                    list.added(entry.id);
                                }}
                            >
                                Add experience
                            </AddButton>
                        </>
                    )}
                </form.Field>
            </ProfileSection>
        );
    },
});
