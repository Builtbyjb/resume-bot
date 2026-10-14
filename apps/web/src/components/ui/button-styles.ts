import { cx } from "@/lib/cx";

export type ButtonVariant = "default" | "primary" | "danger" | "dangerSolid";
export type ButtonSize = "md" | "compact" | "sm" | "pack" | "row";
export type ButtonStyle = { variant?: ButtonVariant; size?: ButtonSize };

const base =
    "inline-flex cursor-pointer items-center justify-center rounded-[10px] font-mono leading-[normal] transition-[translate,border-color,box-shadow] duration-150";

const variants: Record<ButtonVariant, string> = {
    default:
        "border border-border bg-transparent text-text hover:border-muted disabled:cursor-progress disabled:opacity-60",
    primary: "bg-accent text-white disabled:cursor-progress disabled:opacity-60",
    danger: "whitespace-nowrap border border-danger/50 bg-transparent text-danger hover:border-danger hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-45",
    dangerSolid:
        "whitespace-nowrap border border-[#dc2626] bg-[#dc2626] text-white disabled:cursor-not-allowed disabled:opacity-45",
};

const sizes: Record<ButtonSize, string> = {
    md: "px-[1.4rem] py-[0.7rem]",
    compact: "px-[1.1rem] py-[0.55rem] text-[0.875rem]",
    sm: "px-4 py-2 text-[0.875rem]",
    pack: "px-4 py-[0.6rem] text-[0.875rem]",
    row: "px-4 py-2 text-[0.85rem]",
};

export function buttonClass({ variant = "default", size = "md" }: ButtonStyle = {}) {
    return cx(base, variants[variant], sizes[size]);
}

/** Classes for links that look like buttons. */
export function linkButtonClass(style: ButtonStyle = {}) {
    return cx(buttonClass(style), "hover:-translate-y-px");
}
