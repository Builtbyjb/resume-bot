import type { BotSettings } from "@resume-bot/shared";

export const mockSettings: BotSettings = {
    enabled: true,
    jobsPerRun: 5,
    interval: { value: 6, unit: "hours" },
    dailyCap: 20,
    activeHours: { start: "09:00", end: "18:00" },
    activeDays: ["mon", "tue", "wed", "thu", "fri"],
    timezone: "America/New_York",
    reviewBeforeApplying: false,
    generateCoverLetters: true,
    notifications: "digest",
};
