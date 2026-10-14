import { subheadingClass } from "@/components/ui/styles";
import { withForm } from "@/lib/form";
import {
    AddButton,
    EntryCard,
    EntryFooter,
    EntryList,
    fieldGridClass,
    ProfileSection,
    RemoveButton,
} from "../components";
import { newCertification, newProject, profileFormOptions } from "../profile-form";
import { useEntryList } from "../use-entry-list";

export const ProjectsSection = withForm({
    ...profileFormOptions,
    render: function ProjectsSection({ form }) {
        const projectList = useEntryList();
        const certificationList = useEntryList();

        return (
            <ProfileSection
                id="projects"
                description="Side projects, open source and credentials that back up your skills."
            >
                <h3 className={subheadingClass}>Projects</h3>
                <form.Field name="projects" mode="array">
                    {(projects) => (
                        <>
                            <EntryList emptyText="No projects added yet.">
                                {projects.state.value.map((entry, i) => (
                                    <EntryCard key={entry.id}>
                                        <div className={fieldGridClass}>
                                            <form.AppField name={`projects[${i}].name`}>
                                                {(field) => (
                                                    <field.TextField
                                                        label="Project name"
                                                        required
                                                        maxLength={120}
                                                        autoFocus={projectList.isNew(entry.id)}
                                                    />
                                                )}
                                            </form.AppField>
                                            <form.AppField name={`projects[${i}].url`}>
                                                {(field) => (
                                                    <field.TextField
                                                        label="Link"
                                                        type="url"
                                                        placeholder="https://"
                                                    />
                                                )}
                                            </form.AppField>
                                            <form.AppField name={`projects[${i}].description`}>
                                                {(field) => (
                                                    <field.TextAreaField
                                                        label="Description"
                                                        full
                                                        hint="What it does, your role, and the tech you used."
                                                        rows={3}
                                                        maxLength={1500}
                                                    />
                                                )}
                                            </form.AppField>
                                        </div>
                                        <EntryFooter>
                                            <RemoveButton
                                                aria-label="Remove this project"
                                                onClick={() => {
                                                    projects.removeValue(i);
                                                    projectList.removed();
                                                }}
                                            />
                                        </EntryFooter>
                                    </EntryCard>
                                ))}
                            </EntryList>
                            <AddButton
                                ref={projectList.addButtonRef}
                                onClick={() => {
                                    const entry = newProject();
                                    projects.pushValue(entry);
                                    projectList.added(entry.id);
                                }}
                            >
                                Add project
                            </AddButton>
                        </>
                    )}
                </form.Field>

                <h3 className={subheadingClass}>Certifications</h3>
                <form.Field name="certifications" mode="array">
                    {(certifications) => (
                        <>
                            <EntryList emptyText="No certifications added yet.">
                                {certifications.state.value.map((entry, i) => (
                                    <EntryCard key={entry.id}>
                                        <div className={fieldGridClass}>
                                            <form.AppField name={`certifications[${i}].name`}>
                                                {(field) => (
                                                    <field.TextField
                                                        label="Certification"
                                                        required
                                                        maxLength={120}
                                                        autoFocus={certificationList.isNew(entry.id)}
                                                    />
                                                )}
                                            </form.AppField>
                                            <form.AppField name={`certifications[${i}].issuer`}>
                                                {(field) => (
                                                    <field.TextField label="Issuer" maxLength={120} />
                                                )}
                                            </form.AppField>
                                            <form.AppField name={`certifications[${i}].issuedOn`}>
                                                {(field) => <field.MonthField label="Issued" />}
                                            </form.AppField>
                                            <form.AppField name={`certifications[${i}].url`}>
                                                {(field) => (
                                                    <field.TextField
                                                        label="Credential link"
                                                        type="url"
                                                        placeholder="https://"
                                                    />
                                                )}
                                            </form.AppField>
                                        </div>
                                        <EntryFooter>
                                            <RemoveButton
                                                aria-label="Remove this certification"
                                                onClick={() => {
                                                    certifications.removeValue(i);
                                                    certificationList.removed();
                                                }}
                                            />
                                        </EntryFooter>
                                    </EntryCard>
                                ))}
                            </EntryList>
                            <AddButton
                                ref={certificationList.addButtonRef}
                                onClick={() => {
                                    const entry = newCertification();
                                    certifications.pushValue(entry);
                                    certificationList.added(entry.id);
                                }}
                            >
                                Add certification
                            </AddButton>
                        </>
                    )}
                </form.Field>
            </ProfileSection>
        );
    },
});
