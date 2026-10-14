import type { CSSProperties, ReactNode } from "react";

const tones = {
    idle: "#a1a1aa",
    blue: "#60a5fa",
    violet: "#a78bfa",
    green: "#4ade80",
    red: "#f87171",
    orange: "#fb923c",
    amber: "#fbbf24",
} as const;

export type BadgeTone = keyof typeof tones;

export function StatusBadge({ tone, children }: { tone: BadgeTone; children: ReactNode }) {
    return (
        <span
            style={{ "--badge": tones[tone] } as CSSProperties}
            className="inline-flex items-center gap-[0.4rem] whitespace-nowrap rounded-full border border-[color-mix(in_srgb,var(--badge)_35%,transparent)] bg-[color-mix(in_srgb,var(--badge)_14%,transparent)] px-[0.6rem] py-[0.15rem] text-[0.75rem] text-(--badge) before:size-1.5 before:rounded-full before:bg-current before:content-['']"
        >
            {children}
        </span>
    );
}

/** The dot + label used for "Running / Paused" and "On / Off". */
export function StateIndicator({ on, children }: { on: boolean; children: ReactNode }) {
    return (
        <span
            className={`inline-flex items-center gap-[0.45rem] text-[0.8rem] before:size-2 before:rounded-full before:bg-current before:content-[''] ${on ? "text-success" : "text-idle"}`}
        >
            {children}
        </span>
    );
}
