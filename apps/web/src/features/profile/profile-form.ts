import { formOptions, revalidateLogic } from "@tanstack/react-form";
import {
    profileSchema,
    type Certification,
    type Education,
    type Experience,
    type Language,
    type Profile,
    type Project,
    type Resume,
} from "@resume-bot/shared";

/** Everything on the profile form. The resume is uploaded on its own, outside the form. */
export type ProfileValues = Omit<Profile, "resume">;

export function toProfileValues(profile: Profile): ProfileValues {
    const values: Partial<Profile> = { ...profile };
    delete values.resume;
    return values as ProfileValues;
}

export const profileFormOptions = formOptions({
    defaultValues: {} as ProfileValues,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: profileSchema },
});

export const sections = [
    { id: "resume", title: "Resume" },
    { id: "personal", title: "Personal info" },
    { id: "summary", title: "Summary" },
    { id: "experience", title: "Experience" },
    { id: "education", title: "Education" },
    { id: "skills", title: "Skills & languages" },
    { id: "projects", title: "Projects & certifications" },
    { id: "preferences", title: "Job preferences" },
    { id: "application", title: "Application questions" },
    { id: "writing", title: "AI writing" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export const sectionTitle = (id: SectionId) => sections.find((s) => s.id === id)!.title;

export const newExperience = (): Experience => ({
    id: crypto.randomUUID(),
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: null,
    current: false,
    achievements: [],
});

export const newEducation = (): Education => ({
    id: crypto.randomUUID(),
    school: "",
    degree: "",
    field: "",
    startDate: null,
    endDate: null,
    notes: "",
});

export const newLanguage = (): Language => ({
    id: crypto.randomUUID(),
    name: "",
    proficiency: "professional",
});

export const newProject = (): Project => ({
    id: crypto.randomUUID(),
    name: "",
    url: "",
    description: "",
});

export const newCertification = (): Certification => ({
    id: crypto.randomUUID(),
    name: "",
    issuer: "",
    issuedOn: null,
    url: "",
});

const trim = (value: string) => value.trim();

/** The payload sent to the API: trimmed text, one achievement per non-empty line. */
export function normalizeProfile(values: ProfileValues): ProfileValues {
    return {
        ...values,
        firstName: trim(values.firstName),
        lastName: trim(values.lastName),
        phone: trim(values.phone),
        location: trim(values.location),
        links: {
            linkedin: trim(values.links.linkedin),
            github: trim(values.links.github),
            portfolio: trim(values.links.portfolio),
        },
        headline: trim(values.headline),
        summary: trim(values.summary),
        experience: values.experience.map((entry) => ({
            ...entry,
            title: trim(entry.title),
            company: trim(entry.company),
            location: trim(entry.location),
            endDate: entry.current ? null : entry.endDate,
            achievements: entry.achievements.map(trim).filter(Boolean),
        })),
        education: values.education.map((entry) => ({
            ...entry,
            school: trim(entry.school),
            degree: trim(entry.degree),
            field: trim(entry.field),
            notes: trim(entry.notes),
        })),
        languages: values.languages.map((entry) => ({ ...entry, name: trim(entry.name) })),
        projects: values.projects.map((entry) => ({
            ...entry,
            name: trim(entry.name),
            url: trim(entry.url),
            description: trim(entry.description),
        })),
        certifications: values.certifications.map((entry) => ({
            ...entry,
            name: trim(entry.name),
            issuer: trim(entry.issuer),
            url: trim(entry.url),
        })),
        writing: { ...values.writing, instructions: trim(values.writing.instructions) },
    };
}

export type SectionStatus = "complete" | "missing" | "empty";

export const statusLabels: Record<SectionStatus, string> = {
    complete: "complete",
    missing: "missing required info",
    empty: "not started",
};

const filled = (value: string) => value.trim() !== "";

/** Sections with required info are "missing" until it's filled in; the rest just need any content. */
export function sectionStatuses(
    values: ProfileValues,
    resume: Resume | null,
): Record<SectionId, SectionStatus> {
    const required = (...checks: boolean[]): SectionStatus =>
        checks.every(Boolean) ? "complete" : "missing";
    const content = (hasContent: boolean): SectionStatus => (hasContent ? "complete" : "empty");
    const { preferences, application, writing } = values;

    return {
        resume: content(resume !== null),
        personal: required(
            filled(values.firstName),
            filled(values.lastName),
            filled(values.phone),
            filled(values.location),
        ),
        summary: required(filled(values.headline), filled(values.summary)),
        experience: content(values.experience.length > 0),
        education: content(values.education.length > 0),
        skills: required(values.skills.length > 0),
        projects: content(values.projects.length + values.certifications.length > 0),
        preferences: required(
            preferences.titles.length > 0,
            preferences.locations.length > 0,
            preferences.workModes.length > 0,
        ),
        application: required(
            application.workAuthorized !== null,
            application.needsSponsorship !== null,
        ),
        writing: content(Boolean(writing.tone) || filled(writing.instructions)),
    };
}
