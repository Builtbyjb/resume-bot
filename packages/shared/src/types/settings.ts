export type IntervalUnit = "minutes" | "hours" | "days";

export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type NotificationMode = "every" | "digest" | "failures" | "off";

export type BotSettings = {
    enabled: boolean;
    jobsPerRun: number;
    interval: { value: number; unit: IntervalUnit };
    dailyCap: number;
    /** 24h "HH:MM" in `timezone`. If end < start the window runs overnight. */
    activeHours: { start: string; end: string };
    activeDays: Weekday[];
    timezone: string;
    reviewBeforeApplying: boolean;
    generateCoverLetters: boolean;
    notifications: NotificationMode;
};

type Range = { min: number; max: number };

export const settingsLimits = {
    jobsPerRun: { min: 1, max: 25 },
    dailyCap: { min: 1, max: 100 },
    interval: {
        minutes: { min: 15, max: 1440 },
        hours: { min: 1, max: 168 },
        days: { min: 1, max: 30 },
    } satisfies Record<IntervalUnit, Range>,
};
