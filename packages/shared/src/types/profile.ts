import type { WorkMode } from "./job";

/** "YYYY-MM" */
export type YearMonth = string;

export type Experience = {
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: YearMonth;
    endDate: YearMonth | null;
    current: boolean;
    achievements: string[];
};

export type Education = {
    id: string;
    school: string;
    degree: string;
    field: string;
    startDate: YearMonth | null;
    endDate: YearMonth | null;
    notes: string;
};

export type LanguageProficiency = "basic" | "conversational" | "professional" | "native";

export type Language = {
    id: string;
    name: string;
    proficiency: LanguageProficiency;
};

export type Project = {
    id: string;
    name: string;
    url: string;
    description: string;
};

export type Certification = {
    id: string;
    name: string;
    issuer: string;
    issuedOn: YearMonth | null;
    url: string;
};

export type JobBoard =
    | "linkedin"
    | "indeed"
    | "glassdoor"
    | "wellfound"
    | "hacker_news"
    | "company_sites";

export type NoticePeriod =
    | "immediately"
    | "1_week"
    | "2_weeks"
    | "1_month"
    | "2_months"
    | "3_months_plus";

export type CoverLetterTone = "professional" | "friendly" | "enthusiastic" | "concise";

export type SalaryPeriod = "year" | "hour";

export type Resume = { fileName: string; url: string; uploadedAt: Date };

export type Profile = {
    firstName: string;
    lastName: string;
    phone: string;
    location: string;
    links: { linkedin: string; github: string; portfolio: string };
    headline: string;
    summary: string;
    experience: Experience[];
    education: Education[];
    skills: string[];
    languages: Language[];
    projects: Project[];
    certifications: Certification[];
    preferences: {
        titles: string[];
        locations: string[];
        workModes: WorkMode[];
        minSalary: { amount: number | null; currency: string; period: SalaryPeriod };
        excludedCompanies: string[];
        jobBoards: JobBoard[];
    };
    /** null = not answered yet */
    application: {
        workAuthorized: boolean | null;
        needsSponsorship: boolean | null;
        willingToRelocate: boolean | null;
        noticePeriod: NoticePeriod;
        earliestStart: string | null;
    };
    writing: {
        tone: CoverLetterTone;
        instructions: string;
    };
    resume: Resume | null;
};

export const MAX_RESUME_BYTES = 5 * 1024 * 1024;
