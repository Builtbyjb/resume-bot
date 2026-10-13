import type { Profile } from "../types/profile";

export const mockProfile: Profile = {
    firstName: "Alex",
    lastName: "Morgan",
    phone: "+1 555 010 2030",
    location: "Brooklyn, NY",
    links: {
        linkedin: "https://www.linkedin.com/in/alexmorgan",
        github: "https://github.com/alexmorgan",
        portfolio: "",
    },
    headline: "Frontend engineer focused on fast, accessible web apps",
    summary: "",
    experience: [
        {
            id: "exp-1",
            title: "Frontend Engineer",
            company: "Acme Analytics",
            location: "New York, NY",
            startDate: "2023-03",
            endDate: null,
            current: true,
            achievements: [
                "Rebuilt the dashboard in TypeScript, cutting load time by 45%",
                "Led the move to a shared component library used by 4 teams",
            ],
        },
        {
            id: "exp-2",
            title: "Junior Web Developer",
            company: "Brightside Studio",
            location: "Remote",
            startDate: "2021-06",
            endDate: "2023-02",
            current: false,
            achievements: ["Shipped 12 client sites with a focus on accessibility (WCAG AA)"],
        },
    ],
    education: [
        {
            id: "edu-1",
            school: "Rutgers University",
            degree: "B.S.",
            field: "Computer Science",
            startDate: "2017-09",
            endDate: "2021-05",
            notes: "",
        },
    ],
    skills: ["TypeScript", "React", "CSS", "Node.js", "Accessibility"],
    languages: [
        { id: "lang-1", name: "English", proficiency: "native" },
        { id: "lang-2", name: "Spanish", proficiency: "conversational" },
    ],
    projects: [],
    certifications: [],
    preferences: {
        titles: ["Frontend Engineer", "Full Stack Developer"],
        locations: ["New York, NY", "Remote (US)"],
        workModes: ["remote", "hybrid"],
        minSalary: { amount: 140000, currency: "USD", period: "year" },
        excludedCompanies: ["Acme Analytics"],
        jobBoards: ["linkedin", "wellfound", "company_sites"],
    },
    application: {
        workAuthorized: true,
        needsSponsorship: null,
        willingToRelocate: false,
        noticePeriod: "2_weeks",
        earliestStart: null,
    },
    writing: {
        tone: "professional",
        instructions: "",
    },
    resume: null,
};
