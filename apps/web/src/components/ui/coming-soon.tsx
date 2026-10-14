import type { ReactNode } from "react";
import { isComingSoon, type Feature } from "@/lib/features";

type Props = {
    feature: Feature;
    title: string;
    description: string;
    children: ReactNode;
};

export function SoonBadge({ className, children = "Soon" }: { className?: string; children?: ReactNode }) {
    return (
        <span
            className={`inline-flex items-center whitespace-nowrap rounded-full border border-warning/40 bg-warning/12 px-2 py-[0.1rem] text-[0.65rem] tracking-[0.04em] text-warning uppercase ${className ?? ""}`}
        >
            {children}
        </span>
    );
}

/** Renders `children` as-is when the feature is live, otherwise as a dimmed, inert preview. */
export function ComingSoon({ feature, title, description, children }: Props) {
    if (!isComingSoon(feature)) return children;

    return (
        <div className="relative">
            <div
                role="note"
                aria-labelledby="coming-soon-title"
                className="sticky top-6 z-[3] mx-auto mb-6 flex max-w-[520px] flex-col items-center gap-[0.6rem] rounded-2xl border border-muted/18 bg-surface px-7 py-6 text-center shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
            >
                <SoonBadge>Coming soon</SoonBadge>
                <h2 id="coming-soon-title" className="text-[1.3rem]">
                    {title}
                </h2>
                <p className="text-[0.875rem] text-muted opacity-80">{description}</p>
            </div>
            <div
                inert
                aria-hidden="true"
                className="pointer-events-none opacity-35 grayscale-40 select-none [mask-image:linear-gradient(to_bottom,#000_60%,transparent)]"
            >
                {children}
            </div>
        </div>
    );
}
