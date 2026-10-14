import { useEffect, useState, type CSSProperties } from "react";
import { useStore } from "@tanstack/react-form";
import type { Profile, Resume } from "@resume-bot/shared";
import { PageHeader, stackClass } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast-context";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { api } from "@/lib/api";
import { cx } from "@/lib/cx";
import { useAppForm } from "@/lib/form";
import {
    normalizeProfile,
    profileFormOptions,
    sections,
    sectionStatuses,
    statusLabels,
    toProfileValues,
    type ProfileValues,
    type SectionId,
    type SectionStatus,
} from "./profile-form";
import { ApplicationSection } from "./sections/application-section";
import { EducationSection } from "./sections/education-section";
import { ExperienceSection } from "./sections/experience-section";
import { PersonalSection } from "./sections/personal-section";
import { PreferencesSection } from "./sections/preferences-section";
import { ProjectsSection } from "./sections/projects-section";
import { ResumeSection } from "./sections/resume-section";
import { SkillsSection } from "./sections/skills-section";
import { SummarySection } from "./sections/summary-section";
import { WritingSection } from "./sections/writing-section";

type Props = {
    profile: Profile;
    email: string;
};

const focusFirstInvalid = () =>
    requestAnimationFrame(() =>
        document.querySelector<HTMLElement>("#profile-form [aria-invalid='true']")?.focus(),
    );

export function ProfilePage({ profile, email }: Props) {
    const showToast = useToast();
    const [saved, setSaved] = useState<ProfileValues>(() => toProfileValues(profile));
    const [resume, setResume] = useState<Resume | null>(profile.resume);

    const form = useAppForm({
        ...profileFormOptions,
        defaultValues: saved,
        onSubmitInvalid: focusFirstInvalid,
        onSubmit: async ({ value, formApi }) => {
            try {
                await api("/profile", { method: "PUT", body: normalizeProfile(value) });
                setSaved(value);
                formApi.reset(value);
                showToast("Profile saved");
            } catch {
                showToast("Couldn't save your profile. Please try again.", "error");
            }
        },
    });

    const values = useStore(form.store, (state) => state.values);
    const dirty =
        JSON.stringify(normalizeProfile(values)) !== JSON.stringify(normalizeProfile(saved));
    useUnsavedChanges(dirty);

    return (
        <>
            <PageHeader title="Profile" />
            <div className="grid grid-cols-[220px_minmax(0,760px)] items-start gap-10 max-[1100px]:grid-cols-[minmax(0,760px)] max-[1100px]:gap-6">
                <ProfileNav statuses={sectionStatuses(values, resume)} />
                <div className={stackClass}>
                    <p className="-mt-3 text-[0.8rem] text-muted opacity-70">
                        Fields marked <span className="text-warning">*</span> are required.
                    </p>
                    <ResumeSection resume={resume} onChange={setResume} />
                    <form
                        id="profile-form"
                        className={stackClass}
                        autoComplete="off"
                        noValidate
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            void form.handleSubmit();
                        }}
                    >
                        <PersonalSection form={form} email={email} />
                        <SummarySection form={form} />
                        <ExperienceSection form={form} />
                        <EducationSection form={form} />
                        <SkillsSection form={form} />
                        <ProjectsSection form={form} />
                        <PreferencesSection form={form} />
                        <ApplicationSection form={form} />
                        <WritingSection form={form} />

                        <form.AppForm>
                            <form.SaveBar dirty={dirty} onDiscard={() => form.reset()} />
                        </form.AppForm>
                    </form>
                </div>
            </div>
        </>
    );
}

/** Tracks which section is in the upper part of the viewport. */
function useActiveSection() {
    const [active, setActive] = useState<SectionId | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.find((entry) => entry.isIntersecting);
                if (visible) setActive(visible.target.id as SectionId);
            },
            { rootMargin: "-20% 0px -70% 0px" },
        );
        for (const section of sections) {
            const element = document.getElementById(section.id);
            if (element) observer.observe(element);
        }
        return () => observer.disconnect();
    }, []);

    return active;
}

const statusDotStyles: Record<SectionStatus, CSSProperties | undefined> = {
    complete: {
        borderColor: "#4ade80",
        background:
            "#4ade80 url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231f1f1f' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12l5 5 9-10'/%3E%3C/svg%3E\") center / 9px no-repeat",
    },
    missing: {
        borderColor: "#fbbf24",
        background: "radial-gradient(circle, #fbbf24 0 3px, transparent 3.5px)",
    },
    empty: undefined,
};

function ProfileNav({ statuses }: { statuses: Record<SectionId, SectionStatus> }) {
    const active = useActiveSection();

    const complete = sections.filter((s) => statuses[s.id] === "complete").length;
    const missing = sections.filter((s) => statuses[s.id] === "missing").map((s) => s.title);
    const percent = Math.round((complete / sections.length) * 100);

    const summary = missing.length
        ? `Required info missing in: ${missing.join(", ")}.`
        : percent === 100
          ? "Your profile is complete."
          : "All required info is filled in. Optional sections make applications stronger.";

    return (
        <nav
            aria-label="Profile sections"
            className="sticky top-10 flex flex-col gap-6 max-[1100px]:static"
        >
            <div className="flex flex-col gap-[0.6rem] rounded-xl border border-muted/12 p-4">
                <div className="flex items-baseline justify-between text-[0.8rem] text-muted">
                    <span>Profile</span>
                    <strong className="font-grotesk text-[1.4rem] text-text">{percent}%</strong>
                </div>
                <div
                    role="progressbar"
                    aria-label="Profile completeness"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={percent}
                    className="h-1.5 overflow-hidden rounded-full bg-muted/12"
                >
                    <div
                        className="h-full rounded-[inherit] bg-accent transition-[width] duration-300"
                        style={{ width: `${percent}%` }}
                    />
                </div>
                <p
                    className={cx(
                        "text-[0.75rem] leading-normal",
                        missing.length ? "text-warning" : "text-muted opacity-75",
                    )}
                >
                    {summary}
                </p>
            </div>
            <ol className="flex flex-col gap-[0.15rem] max-[1100px]:flex-row max-[1100px]:overflow-x-auto max-[1100px]:pb-1">
                {sections.map((section) => (
                    <li key={section.id}>
                        <a
                            href={`#${section.id}`}
                            aria-current={active === section.id || undefined}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(section.id)?.scrollIntoView();
                            }}
                            className="flex items-center justify-between gap-3 rounded-lg px-3 py-[0.45rem] text-[0.85rem] text-muted opacity-75 transition-[background-color,opacity] duration-150 hover:bg-muted/6 hover:opacity-100 aria-[current=true]:bg-muted/8 aria-[current=true]:text-text aria-[current=true]:opacity-100 max-[1100px]:whitespace-nowrap"
                        >
                            <span>{section.title}</span>
                            <span
                                aria-hidden="true"
                                style={statusDotStyles[statuses[section.id]]}
                                className="size-3.5 shrink-0 rounded-full border-[1.5px] border-muted/35"
                            />
                            <span className="sr-only">({statusLabels[statuses[section.id]]})</span>
                        </a>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
