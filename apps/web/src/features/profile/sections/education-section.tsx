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
import { newEducation, profileFormOptions } from "../profile-form";
import { useEntryList } from "../use-entry-list";

export const EducationSection = withForm({
    ...profileFormOptions,
    render: function EducationSection({ form }) {
        const list = useEntryList();

        return (
            <ProfileSection
                id="education"
                description="Degrees, bootcamps and other formal education."
            >
                <form.Field name="education" mode="array">
                    {(education) => (
                        <>
                            <EntryList emptyText="No education added yet.">
                                {education.state.value.map((entry, i) => (
                                    <EntryCard key={entry.id}>
                                        <div className={fieldGridClass}>
                                            <form.AppField name={`education[${i}].school`}>
                                                {(field) => (
                                                    <field.TextField
                                                        label="School"
                                                        required
                                                        maxLength={120}
                                                        autoFocus={list.isNew(entry.id)}
                                                    />
                                                )}
                                            </form.AppField>
                                            <form.AppField name={`education[${i}].degree`}>
                                                {(field) => (
                                                    <field.TextField
                                                        label="Degree"
                                                        required
                                                        placeholder="e.g. B.S., Bootcamp certificate"
                                                        maxLength={120}
                                                    />
                                                )}
                                            </form.AppField>
                                            <form.AppField name={`education[${i}].field`}>
                                                {(field) => (
                                                    <field.TextField
                                                        label="Field of study"
                                                        maxLength={120}
                                                    />
                                                )}
                                            </form.AppField>
                                            <div className={dateRangeClass}>
                                                <form.AppField name={`education[${i}].startDate`}>
                                                    {(field) => <field.MonthField label="Start" />}
                                                </form.AppField>
                                                <form.AppField name={`education[${i}].endDate`}>
                                                    {(field) => (
                                                        <field.MonthField label="End (or expected)" />
                                                    )}
                                                </form.AppField>
                                            </div>
                                            <form.AppField name={`education[${i}].notes`}>
                                                {(field) => (
                                                    <field.TextField
                                                        label="Notes"
                                                        full
                                                        hint="GPA, honors, relevant coursework, thesis…"
                                                        maxLength={300}
                                                    />
                                                )}
                                            </form.AppField>
                                        </div>
                                        <EntryFooter>
                                            <RemoveButton
                                                aria-label="Remove this education"
                                                onClick={() => {
                                                    education.removeValue(i);
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
                                    const entry = newEducation();
                                    education.pushValue(entry);
                                    list.added(entry.id);
                                }}
                            >
                                Add education
                            </AddButton>
                        </>
                    )}
                </form.Field>
            </ProfileSection>
        );
    },
});
