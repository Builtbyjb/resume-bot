import type { LanguageProficiency } from "@resume-bot/shared";
import { GroupField } from "@/components/ui/field";
import { subheadingClass } from "@/components/ui/styles";
import { withForm } from "@/lib/form";
import {
    AddButton,
    EntryCard,
    EntryList,
    fieldGridClass,
    ProfileSection,
    RemoveButton,
} from "../components";
import { newLanguage, profileFormOptions } from "../profile-form";
import { useEntryList } from "../use-entry-list";

const proficiencyOptions: { value: LanguageProficiency; label: string }[] = [
    { value: "basic", label: "Basic" },
    { value: "conversational", label: "Conversational" },
    { value: "professional", label: "Professional" },
    { value: "native", label: "Native / bilingual" },
];

export const SkillsSection = withForm({
    ...profileFormOptions,
    render: function SkillsSection({ form }) {
        const list = useEntryList();

        return (
            <ProfileSection
                id="skills"
                description="Used to match you with jobs and highlight the right keywords."
            >
                <form.AppField name="skills">
                    {(field) => (
                        <GroupField
                            labelId="skills-label"
                            label="Skills"
                            required
                            hint="Press Enter or comma to add. Put your strongest skills first."
                        >
                            <field.TagInput labelId="skills-label" placeholder="e.g. TypeScript" />
                            <field.FieldError />
                        </GroupField>
                    )}
                </form.AppField>

                <h3 className={subheadingClass}>Languages</h3>
                <form.Field name="languages" mode="array">
                    {(languages) => (
                        <>
                            <EntryList emptyText="No languages added yet.">
                                {languages.state.value.map((entry, i) => (
                                    <EntryCard key={entry.id} inline>
                                        <div className={fieldGridClass}>
                                            <form.AppField name={`languages[${i}].name`}>
                                                {(field) => (
                                                    <field.TextField
                                                        label="Language"
                                                        required
                                                        maxLength={60}
                                                        autoFocus={list.isNew(entry.id)}
                                                    />
                                                )}
                                            </form.AppField>
                                            <form.AppField name={`languages[${i}].proficiency`}>
                                                {(field) => (
                                                    <field.SelectField
                                                        label="Proficiency"
                                                        options={proficiencyOptions}
                                                    />
                                                )}
                                            </form.AppField>
                                        </div>
                                        <RemoveButton
                                            aria-label="Remove this language"
                                            onClick={() => {
                                                languages.removeValue(i);
                                                list.removed();
                                            }}
                                        />
                                    </EntryCard>
                                ))}
                            </EntryList>
                            <AddButton
                                ref={list.addButtonRef}
                                onClick={() => {
                                    const entry = newLanguage();
                                    languages.pushValue(entry);
                                    list.added(entry.id);
                                }}
                            >
                                Add language
                            </AddButton>
                        </>
                    )}
                </form.Field>
            </ProfileSection>
        );
    },
});
