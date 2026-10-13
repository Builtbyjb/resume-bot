import { html } from "hono/html";
import type { HtmlEscapedString } from "hono/utils/html";
import AuthLayout from "../layouts/auth-layout";
import type { WorkMode } from "../types/job";
import type {
    Certification,
    CoverLetterTone,
    Education,
    Experience,
    JobBoard,
    Language,
    LanguageProficiency,
    NoticePeriod,
    Profile,
    Project,
} from "../types/profile";
import {
    btn,
    btnPrimary,
    pageHeader,
    settingsCard,
    settingsLayout,
    settingLabel,
    controlGroup,
    fieldInput,
    chipPicker,
    radioList,
    saveBar,
    toast,
    srOnly,
    profileLayout,
    profileNav,
    statusDot,
    completeness,
    profileSection,
    requiredLegend,
    cardBody,
    fieldGrid,
    field,
    checkField,
    subheading,
    entryList,
    entryCard,
    dateRange,
    removeButton,
    addButton,
    tagInput,
    segmented,
    questionRow,
    dropzone,
    resumeFile,
} from "../styles/style";

type Props = {
    profile: Profile;
    email: string;
};

type Content = HtmlEscapedString | Promise<HtmlEscapedString>;

const sections = [
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

type SectionId = (typeof sections)[number]["id"];

const proficiencyOptions: { value: LanguageProficiency; label: string }[] = [
    { value: "basic", label: "Basic" },
    { value: "conversational", label: "Conversational" },
    { value: "professional", label: "Professional" },
    { value: "native", label: "Native / bilingual" },
];

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

const noticePeriodOptions: { value: NoticePeriod; label: string }[] = [
    { value: "immediately", label: "Available immediately" },
    { value: "1_week", label: "1 week" },
    { value: "2_weeks", label: "2 weeks" },
    { value: "1_month", label: "1 month" },
    { value: "2_months", label: "2 months" },
    { value: "3_months_plus", label: "3 months or more" },
];

const toneOptions: {
    value: CoverLetterTone;
    label: string;
    description: string;
}[] = [
    {
        value: "professional",
        label: "Professional",
        description: "Polished and formal.",
    },
    {
        value: "friendly",
        label: "Friendly",
        description: "Warm and conversational.",
    },
    {
        value: "enthusiastic",
        label: "Enthusiastic",
        description: "Shows real excitement for the role.",
    },
    {
        value: "concise",
        label: "Concise",
        description: "Short and to the point.",
    },
];

const dateFormat = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
});

const checked = (value: boolean) => (value ? "checked" : "");
const selected = (value: boolean) => (value ? "selected" : "");

// Native month pickers fall back to text inputs in some browsers; the pattern keeps that path valid.
const monthAttrs = html`type="month" placeholder="YYYY-MM" pattern="[0-9]{4}-[0-9]{2}"`;

const fileIcon = html`<svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
</svg>`;

const uploadIcon = html`<svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
>
    <path d="M12 16V4" />
    <path d="m7 9 5-5 5 5" />
    <path d="M5 20h14" />
</svg>`;

function Section(props: { id: SectionId; description: string; children: Content }) {
    const title = sections.find((s) => s.id === props.id)!.title;
    return html`
        <section
            id="${props.id}"
            class="${settingsCard} ${profileSection}"
            data-profile-section
            data-title="${title}"
            aria-labelledby="${props.id}-title"
        >
            <header>
                <h2 id="${props.id}-title">${title}</h2>
                <p>${props.description}</p>
            </header>
            <div class="${cardBody}">${props.children}</div>
        </section>
    `;
}

function Field(props: { label: string; control: Content; hint?: string; full?: boolean }) {
    return html`
        <label class="${field}" ${props.full ? html`data-span="full"` : ""}>
            <span>${props.label}</span>
            ${props.control} ${props.hint ? html`<small>${props.hint}</small>` : ""}
        </label>
    `;
}

/** For controls that aren't a single input (tag inputs, chip groups), so they can't sit inside a <label>. */
function GroupField(props: { id: string; label: string; control: Content; hint?: string }) {
    return html`
        <div class="${field}" data-span="full">
            <span id="${props.id}-label">${props.label}</span>
            ${props.control} ${props.hint ? html`<small>${props.hint}</small>` : ""}
        </div>
    `;
}

function TagInput(props: {
    name: string;
    values: string[];
    labelId: string;
    placeholder: string;
    required?: boolean;
}) {
    return html`
        <div
            class="${tagInput}"
            data-tags="${props.name}"
            role="group"
            aria-labelledby="${props.labelId}"
            ${props.required ? "data-required" : ""}
        >
            <ul data-tag-list>
                ${props.values.map(
                    (value) => html`
                        <li>
                            <input type="hidden" name="${props.name}" value="${value}" />
                            <span>${value}</span>
                            <button type="button" data-remove-tag aria-label="Remove ${value}">
                                ×
                            </button>
                        </li>
                    `,
                )}
            </ul>
            <input
                type="text"
                data-tag-entry
                maxlength="60"
                placeholder="${props.placeholder}"
                aria-labelledby="${props.labelId}"
            />
        </div>
    `;
}

function ChipGroup<T extends string>(props: {
    name: string;
    labelId: string;
    options: { value: T; label: string }[];
    values: T[];
    required?: boolean;
}) {
    return html`
        <div
            class="${chipPicker}"
            role="group"
            aria-labelledby="${props.labelId}"
            ${props.required ? "data-required" : ""}
        >
            ${props.options.map(
                (option) => html`
                    <label>
                        <input
                            type="checkbox"
                            name="${props.name}"
                            value="${option.value}"
                            ${checked(props.values.includes(option.value))}
                        />
                        <span>${option.label}</span>
                    </label>
                `,
            )}
        </div>
    `;
}

function YesNoQuestion(props: {
    name: string;
    label: string;
    value: boolean | null;
    required?: boolean;
}) {
    const labelId = `${props.name}-label`;
    return html`
        <div class="${questionRow}">
            <span id="${labelId}">${props.label}</span>
            <div
                class="${segmented}"
                role="radiogroup"
                aria-labelledby="${labelId}"
                ${props.required ? "data-required" : ""}
            >
                <label>
                    <input
                        type="radio"
                        name="${props.name}"
                        value="yes"
                        ${checked(props.value === true)}
                    />
                    <span>Yes</span>
                </label>
                <label>
                    <input
                        type="radio"
                        name="${props.name}"
                        value="no"
                        ${checked(props.value === false)}
                    />
                    <span>No</span>
                </label>
            </div>
        </div>
    `;
}

function RemoveButton(label: string) {
    return html`<button
        type="button"
        class="${removeButton}"
        data-remove-entry
        aria-label="${label}"
    >
        Remove
    </button>`;
}

function ExperienceEntry(entry?: Experience) {
    const current = entry?.current ?? false;
    return html`
        <div class="${entryCard}" data-entry data-entry-id="${entry?.id ?? ""}">
            <div class="${fieldGrid}">
                ${Field({
                    label: "Job title",
                    control: html`<input
                        class="${fieldInput}"
                        data-field="title"
                        value="${entry?.title ?? ""}"
                        maxlength="120"
                        required
                    />`,
                })}
                ${Field({
                    label: "Company",
                    control: html`<input
                        class="${fieldInput}"
                        data-field="company"
                        value="${entry?.company ?? ""}"
                        maxlength="120"
                        required
                    />`,
                })}
                ${Field({
                    label: "Location",
                    control: html`<input
                        class="${fieldInput}"
                        data-field="location"
                        value="${entry?.location ?? ""}"
                        placeholder="City, country or Remote"
                        maxlength="120"
                    />`,
                })}
                <div class="${dateRange}">
                    ${Field({
                        label: "Start",
                        control: html`<input
                            class="${fieldInput}"
                            ${monthAttrs}
                            data-field="startDate"
                            value="${entry?.startDate ?? ""}"
                            required
                        />`,
                    })}
                    ${Field({
                        label: "End",
                        control: html`<input
                            class="${fieldInput}"
                            ${monthAttrs}
                            data-field="endDate"
                            value="${entry?.endDate ?? ""}"
                            ${current ? "disabled" : ""}
                        />`,
                    })}
                </div>
                ${Field({
                    label: "Key achievements",
                    full: true,
                    hint: "One per line. The AI picks the most relevant ones for each job.",
                    control: html`<textarea
                        class="${fieldInput}"
                        data-field="achievements"
                        rows="4"
                        maxlength="3000"
                    >
${(entry?.achievements ?? []).join("\n")}</textarea
                    >`,
                })}
            </div>
            <footer>
                <label class="${checkField}">
                    <input type="checkbox" data-field="current" ${checked(current)} />
                    I currently work here
                </label>
                ${RemoveButton("Remove this experience")}
            </footer>
        </div>
    `;
}

function EducationEntry(entry?: Education) {
    return html`
        <div class="${entryCard}" data-entry data-entry-id="${entry?.id ?? ""}">
            <div class="${fieldGrid}">
                ${Field({
                    label: "School",
                    control: html`<input
                        class="${fieldInput}"
                        data-field="school"
                        value="${entry?.school ?? ""}"
                        maxlength="120"
                        required
                    />`,
                })}
                ${Field({
                    label: "Degree",
                    control: html`<input
                        class="${fieldInput}"
                        data-field="degree"
                        value="${entry?.degree ?? ""}"
                        placeholder="e.g. B.S., Bootcamp certificate"
                        maxlength="120"
                        required
                    />`,
                })}
                ${Field({
                    label: "Field of study",
                    control: html`<input
                        class="${fieldInput}"
                        data-field="field"
                        value="${entry?.field ?? ""}"
                        maxlength="120"
                    />`,
                })}
                <div class="${dateRange}">
                    ${Field({
                        label: "Start",
                        control: html`<input
                            class="${fieldInput}"
                            ${monthAttrs}
                            data-field="startDate"
                            value="${entry?.startDate ?? ""}"
                        />`,
                    })}
                    ${Field({
                        label: "End (or expected)",
                        control: html`<input
                            class="${fieldInput}"
                            ${monthAttrs}
                            data-field="endDate"
                            value="${entry?.endDate ?? ""}"
                        />`,
                    })}
                </div>
                ${Field({
                    label: "Notes",
                    full: true,
                    hint: "GPA, honors, relevant coursework, thesis…",
                    control: html`<input
                        class="${fieldInput}"
                        data-field="notes"
                        value="${entry?.notes ?? ""}"
                        maxlength="300"
                    />`,
                })}
            </div>
            <footer>${RemoveButton("Remove this education")}</footer>
        </div>
    `;
}

function LanguageEntry(entry?: Language) {
    const proficiency = entry?.proficiency ?? "professional";
    return html`
        <div
            class="${entryCard}"
            data-entry
            data-entry-id="${entry?.id ?? ""}"
            data-layout="inline"
        >
            <div class="${fieldGrid}">
                ${Field({
                    label: "Language",
                    control: html`<input
                        class="${fieldInput}"
                        data-field="name"
                        value="${entry?.name ?? ""}"
                        maxlength="60"
                        required
                    />`,
                })}
                ${Field({
                    label: "Proficiency",
                    control: html`<select class="${fieldInput}" data-field="proficiency">
                        ${proficiencyOptions.map(
                            (o) =>
                                html`<option
                                    value="${o.value}"
                                    ${selected(o.value === proficiency)}
                                >
                                    ${o.label}
                                </option>`,
                        )}
                    </select>`,
                })}
            </div>
            ${RemoveButton("Remove this language")}
        </div>
    `;
}

function ProjectEntry(entry?: Project) {
    return html`
        <div class="${entryCard}" data-entry data-entry-id="${entry?.id ?? ""}">
            <div class="${fieldGrid}">
                ${Field({
                    label: "Project name",
                    control: html`<input
                        class="${fieldInput}"
                        data-field="name"
                        value="${entry?.name ?? ""}"
                        maxlength="120"
                        required
                    />`,
                })}
                ${Field({
                    label: "Link",
                    control: html`<input
                        type="url"
                        class="${fieldInput}"
                        data-field="url"
                        value="${entry?.url ?? ""}"
                        placeholder="https://"
                    />`,
                })}
                ${Field({
                    label: "Description",
                    full: true,
                    hint: "What it does, your role, and the tech you used.",
                    control: html`<textarea
                        class="${fieldInput}"
                        data-field="description"
                        rows="3"
                        maxlength="1500"
                    >
${entry?.description ?? ""}</textarea
                    >`,
                })}
            </div>
            <footer>${RemoveButton("Remove this project")}</footer>
        </div>
    `;
}

function CertificationEntry(entry?: Certification) {
    return html`
        <div class="${entryCard}" data-entry data-entry-id="${entry?.id ?? ""}">
            <div class="${fieldGrid}">
                ${Field({
                    label: "Certification",
                    control: html`<input
                        class="${fieldInput}"
                        data-field="name"
                        value="${entry?.name ?? ""}"
                        maxlength="120"
                        required
                    />`,
                })}
                ${Field({
                    label: "Issuer",
                    control: html`<input
                        class="${fieldInput}"
                        data-field="issuer"
                        value="${entry?.issuer ?? ""}"
                        maxlength="120"
                    />`,
                })}
                ${Field({
                    label: "Issued",
                    control: html`<input
                        class="${fieldInput}"
                        ${monthAttrs}
                        data-field="issuedOn"
                        value="${entry?.issuedOn ?? ""}"
                    />`,
                })}
                ${Field({
                    label: "Credential link",
                    control: html`<input
                        type="url"
                        class="${fieldInput}"
                        data-field="url"
                        value="${entry?.url ?? ""}"
                        placeholder="https://"
                    />`,
                })}
            </div>
            <footer>${RemoveButton("Remove this certification")}</footer>
        </div>
    `;
}

/** A list of inline-editable entries, plus a blank <template> the client clones for "Add". */
function EntryList<T>(props: {
    name: string;
    entries: T[];
    render: (entry?: T) => Content;
    addLabel: string;
    emptyText: string;
}) {
    return html`
        <div class="${entryList}" data-list="${props.name}" data-empty-text="${props.emptyText}">
            ${props.entries.map((entry) => props.render(entry))}
        </div>
        <template data-template="${props.name}">${props.render()}</template>
        <button type="button" class="${addButton}" data-add-entry="${props.name}">
            + ${props.addLabel}
        </button>
    `;
}

function ResumeSection(resume: Profile["resume"]) {
    return Section({
        id: "resume",
        description:
            "Upload your current resume. The AI uses it as reference material alongside the details below.",
        children: html`
            <div class="${resumeFile}" data-resume-file ${resume ? "" : "hidden"}>
                ${fileIcon}
                <span>
                    <a
                        href="${resume?.url ?? "#"}"
                        download="${resume?.fileName ?? ""}"
                        data-resume-link
                    >
                        ${resume?.fileName ?? ""}
                    </a>
                    <small data-resume-date>
                        ${resume ? `Uploaded ${dateFormat.format(resume.uploadedAt)}` : ""}
                    </small>
                </span>
                <div>
                    <label for="resume-input">Replace</label>
                    <button type="button" class="${removeButton}" data-resume-remove>Remove</button>
                </div>
            </div>
            <label class="${dropzone}" data-resume-dropzone ${resume ? "hidden" : ""}>
                ${uploadIcon}
                <strong>Drop your resume here or click to browse</strong>
                <small>PDF, up to 5 MB</small>
                <input
                    type="file"
                    id="resume-input"
                    accept="application/pdf,.pdf"
                    data-resume-input
                    aria-label="Upload resume (PDF)"
                />
            </label>
        `,
    });
}

function ProfileForm({ profile, email }: Props) {
    const { preferences: prefs, application: app } = profile;

    return html`
        <form id="profile-form" class="${settingsLayout}" autocomplete="off" novalidate>
            ${Section({
                id: "personal",
                description: "Shown at the top of every resume and cover letter.",
                children: html`
                    <div class="${fieldGrid}">
                        ${Field({
                            label: "First name",
                            control: html`<input
                                class="${fieldInput}"
                                name="firstName"
                                value="${profile.firstName}"
                                maxlength="60"
                                data-required
                            />`,
                        })}
                        ${Field({
                            label: "Last name",
                            control: html`<input
                                class="${fieldInput}"
                                name="lastName"
                                value="${profile.lastName}"
                                maxlength="60"
                                data-required
                            />`,
                        })}
                        ${Field({
                            label: "Email",
                            hint: "Your sign-in email. Used as the contact address on applications.",
                            control: html`<input
                                type="email"
                                class="${fieldInput}"
                                value="${email}"
                                readonly
                            />`,
                        })}
                        ${Field({
                            label: "Phone",
                            control: html`<input
                                type="tel"
                                class="${fieldInput}"
                                name="phone"
                                value="${profile.phone}"
                                maxlength="30"
                                data-required
                            />`,
                        })}
                        ${Field({
                            label: "Location",
                            full: true,
                            hint: "City and country/state. Recruiters use this to check time zones and eligibility.",
                            control: html`<input
                                class="${fieldInput}"
                                name="location"
                                value="${profile.location}"
                                maxlength="120"
                                data-required
                            />`,
                        })}
                    </div>
                    <h3 class="${subheading}">Links</h3>
                    <div class="${fieldGrid}">
                        ${Field({
                            label: "LinkedIn",
                            control: html`<input
                                type="url"
                                class="${fieldInput}"
                                name="linkedin"
                                value="${profile.links.linkedin}"
                                placeholder="https://www.linkedin.com/in/…"
                            />`,
                        })}
                        ${Field({
                            label: "GitHub",
                            control: html`<input
                                type="url"
                                class="${fieldInput}"
                                name="github"
                                value="${profile.links.github}"
                                placeholder="https://github.com/…"
                            />`,
                        })}
                        ${Field({
                            label: "Portfolio / website",
                            control: html`<input
                                type="url"
                                class="${fieldInput}"
                                name="portfolio"
                                value="${profile.links.portfolio}"
                                placeholder="https://"
                            />`,
                        })}
                    </div>
                `,
            })}
            ${Section({
                id: "summary",
                description: "The AI adapts these to each job description.",
                children: html`
                    ${Field({
                        label: "Headline",
                        hint: "One line, e.g. “Backend engineer specializing in payments”.",
                        control: html`<input
                            class="${fieldInput}"
                            name="headline"
                            value="${profile.headline}"
                            maxlength="120"
                            data-required
                        />`,
                    })}
                    ${Field({
                        label: "Professional summary",
                        hint: "A few sentences about your experience, strengths and what you're looking for.",
                        control: html`<textarea
                            class="${fieldInput}"
                            name="summary"
                            rows="5"
                            maxlength="1500"
                            data-required
                        >
${profile.summary}</textarea
                        >`,
                    })}
                `,
            })}
            ${Section({
                id: "experience",
                description:
                    "Most recent first. Achievements with numbers make the strongest resumes.",
                children: EntryList({
                    name: "experience",
                    entries: profile.experience,
                    render: ExperienceEntry,
                    addLabel: "Add experience",
                    emptyText: "No experience added yet.",
                }),
            })}
            ${Section({
                id: "education",
                description: "Degrees, bootcamps and other formal education.",
                children: EntryList({
                    name: "education",
                    entries: profile.education,
                    render: EducationEntry,
                    addLabel: "Add education",
                    emptyText: "No education added yet.",
                }),
            })}
            ${Section({
                id: "skills",
                description: "Used to match you with jobs and highlight the right keywords.",
                children: html`
                    ${GroupField({
                        id: "skills",
                        label: "Skills",
                        hint: "Press Enter or comma to add. Put your strongest skills first.",
                        control: TagInput({
                            name: "skills",
                            values: profile.skills,
                            labelId: "skills-label",
                            placeholder: "e.g. TypeScript",
                            required: true,
                        }),
                    })}
                    <h3 class="${subheading}">Languages</h3>
                    ${EntryList({
                        name: "languages",
                        entries: profile.languages,
                        render: LanguageEntry,
                        addLabel: "Add language",
                        emptyText: "No languages added yet.",
                    })}
                `,
            })}
            ${Section({
                id: "projects",
                description: "Side projects, open source and credentials that back up your skills.",
                children: html`
                    <h3 class="${subheading}">Projects</h3>
                    ${EntryList({
                        name: "projects",
                        entries: profile.projects,
                        render: ProjectEntry,
                        addLabel: "Add project",
                        emptyText: "No projects added yet.",
                    })}
                    <h3 class="${subheading}">Certifications</h3>
                    ${EntryList({
                        name: "certifications",
                        entries: profile.certifications,
                        render: CertificationEntry,
                        addLabel: "Add certification",
                        emptyText: "No certifications added yet.",
                    })}
                `,
            })}
            ${Section({
                id: "preferences",
                description:
                    "What the bot searches for. Jobs outside these preferences are skipped.",
                children: html`
                    ${GroupField({
                        id: "titles",
                        label: "Target job titles",
                        control: TagInput({
                            name: "titles",
                            values: prefs.titles,
                            labelId: "titles-label",
                            placeholder: "e.g. Frontend Engineer",
                            required: true,
                        }),
                    })}
                    ${GroupField({
                        id: "locations",
                        label: "Locations",
                        hint: "Cities, regions, or “Remote (US)”.",
                        control: TagInput({
                            name: "locations",
                            values: prefs.locations,
                            labelId: "locations-label",
                            placeholder: "e.g. Berlin, Germany",
                            required: true,
                        }),
                    })}
                    ${GroupField({
                        id: "workModes",
                        label: "Work arrangement",
                        control: ChipGroup({
                            name: "workModes",
                            labelId: "workModes-label",
                            options: workModeOptions,
                            values: prefs.workModes,
                            required: true,
                        }),
                    })}
                    <div class="${field}">
                        <span id="minSalary-label">Minimum salary</span>
                        <div class="${controlGroup}" role="group" aria-labelledby="minSalary-label">
                            <input
                                type="number"
                                class="${fieldInput}"
                                name="minSalaryAmount"
                                value="${prefs.minSalary.amount ?? ""}"
                                min="0"
                                step="1000"
                                placeholder="Any"
                                aria-label="Amount"
                            />
                            <select
                                class="${fieldInput}"
                                name="minSalaryCurrency"
                                aria-label="Currency"
                            >
                                ${Intl.supportedValuesOf("currency").map(
                                    (code) =>
                                        html`<option
                                            value="${code}"
                                            ${selected(code === prefs.minSalary.currency)}
                                        >
                                            ${code}
                                        </option>`,
                                )}
                            </select>
                            <span>per</span>
                            <select
                                class="${fieldInput}"
                                name="minSalaryPeriod"
                                aria-label="Period"
                            >
                                <option value="year" ${selected(prefs.minSalary.period === "year")}>
                                    year
                                </option>
                                <option value="hour" ${selected(prefs.minSalary.period === "hour")}>
                                    hour
                                </option>
                            </select>
                        </div>
                        <small
                            >Jobs that list a lower salary are skipped. Leave empty to allow
                            any.</small
                        >
                    </div>
                    ${GroupField({
                        id: "excludedCompanies",
                        label: "Excluded companies",
                        hint: "The bot never applies to these, e.g. your current employer.",
                        control: TagInput({
                            name: "excludedCompanies",
                            values: prefs.excludedCompanies,
                            labelId: "excludedCompanies-label",
                            placeholder: "Company name",
                        }),
                    })}
                    ${GroupField({
                        id: "jobBoards",
                        label: "Job boards to search",
                        hint: "Leave all unselected to search every supported board.",
                        control: ChipGroup({
                            name: "jobBoards",
                            labelId: "jobBoards-label",
                            options: jobBoardOptions,
                            values: prefs.jobBoards,
                        }),
                    })}
                `,
            })}
            ${Section({
                id: "application",
                description: "Answers to questions most application forms ask.",
                children: html`
                    ${YesNoQuestion({
                        name: "workAuthorized",
                        label: "Are you legally authorized to work in the locations you're applying to?",
                        value: app.workAuthorized,
                        required: true,
                    })}
                    ${YesNoQuestion({
                        name: "needsSponsorship",
                        label: "Will you now or in the future require visa sponsorship?",
                        value: app.needsSponsorship,
                        required: true,
                    })}
                    ${YesNoQuestion({
                        name: "willingToRelocate",
                        label: "Are you willing to relocate?",
                        value: app.willingToRelocate,
                    })}
                    <div class="${fieldGrid}">
                        ${Field({
                            label: "Notice period",
                            control: html`<select class="${fieldInput}" name="noticePeriod">
                                ${noticePeriodOptions.map(
                                    (o) =>
                                        html`<option
                                            value="${o.value}"
                                            ${selected(o.value === app.noticePeriod)}
                                        >
                                            ${o.label}
                                        </option>`,
                                )}
                            </select>`,
                        })}
                        ${Field({
                            label: "Earliest start date",
                            hint: "Optional.",
                            control: html`<input
                                type="date"
                                class="${fieldInput}"
                                name="earliestStart"
                                value="${app.earliestStart ?? ""}"
                            />`,
                        })}
                    </div>
                `,
            })}
            ${Section({
                id: "writing",
                description: "Guide how the AI writes your resumes and cover letters.",
                children: html`
                    <div class="${field}">
                        <span id="tone-label">Cover letter tone</span>
                        <div
                            class="${radioList}"
                            role="radiogroup"
                            aria-labelledby="tone-label"
                            data-flush
                        >
                            ${toneOptions.map(
                                (option) => html`
                                    <label>
                                        <input
                                            type="radio"
                                            name="tone"
                                            value="${option.value}"
                                            ${checked(option.value === profile.writing.tone)}
                                        />
                                        <span class="${settingLabel}">
                                            <strong>${option.label}</strong>
                                            <small>${option.description}</small>
                                        </span>
                                    </label>
                                `,
                            )}
                        </div>
                    </div>
                    ${Field({
                        label: "Extra instructions",
                        hint: "Anything the AI should emphasize or avoid in every application.",
                        control: html`<textarea
                            class="${fieldInput}"
                            name="instructions"
                            rows="4"
                            maxlength="2000"
                            placeholder="e.g. Highlight my open-source work. Don't mention my freelance years."
                        >
${profile.writing.instructions}</textarea
                        >`,
                    })}
                `,
            })}

            <div class="${saveBar}" data-save-bar hidden>
                <span>You have unsaved changes</span>
                <div>
                    <button type="button" class="${btn}" data-discard>Discard</button>
                    <button type="submit" class="${btn} ${btnPrimary}">Save changes</button>
                </div>
            </div>
        </form>
    `;
}

function ProfileNav() {
    return html`
        <nav class="${profileNav}" aria-label="Profile sections">
            <div class="${completeness}" data-completeness>
                <div>
                    <span>Profile</span>
                    <strong data-completeness-value>0%</strong>
                </div>
                <div
                    role="progressbar"
                    aria-label="Profile completeness"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow="0"
                    data-completeness-bar
                ></div>
                <p data-completeness-text></p>
            </div>
            <ol>
                ${sections.map(
                    (section) => html`
                        <li>
                            <a href="#${section.id}" data-nav-link="${section.id}">
                                <span>${section.title}</span>
                                <span class="${statusDot}" data-status aria-hidden="true"></span>
                                <span class="${srOnly}" data-status-label></span>
                            </a>
                        </li>
                    `,
                )}
            </ol>
        </nav>
    `;
}

export default function ProfilePage(props: Props) {
    return AuthLayout({
        title: "Profile - Job Bot",
        description: "Your details for personalized resumes and cover letters",
        activePath: "/profile",
        scriptPath: "/profile.js",
        content: html`
            <header class="${pageHeader}">
                <h1>Profile</h1>
            </header>
            <div class="${profileLayout}">
                ${ProfileNav()}
                <div class="${settingsLayout}">
                    <p class="${requiredLegend}">Fields marked <span>*</span> are required.</p>
                    ${ResumeSection(props.profile.resume)} ${ProfileForm(props)}
                </div>
            </div>
            <div class="${toast}" role="status" aria-live="polite" data-toast></div>
        `,
    });
}
