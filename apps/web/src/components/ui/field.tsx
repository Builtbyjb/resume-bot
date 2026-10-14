import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { hintClass } from "./styles";

const fieldClass =
    "flex min-w-0 flex-col gap-[0.35rem] [&_input[readonly]]:cursor-not-allowed [&_input[readonly]]:opacity-60 [&_textarea]:min-h-[5.5rem] [&_textarea]:resize-y [&_textarea]:leading-normal [&>input]:w-full [&>select]:w-full [&>textarea]:w-full";

export function FieldLabel({
    id,
    required,
    children,
}: {
    id?: string;
    required?: boolean;
    children: ReactNode;
}) {
    return (
        <span id={id} className="text-[0.8rem] text-muted">
            {children}
            {required && <span className="text-warning"> *</span>}
        </span>
    );
}

export function Hint({ id, className, children }: { id?: string; className?: string; children: ReactNode }) {
    return (
        <small id={id} className={cx(hintClass, className)}>
            {children}
        </small>
    );
}

type FieldProps = {
    label: ReactNode;
    hint?: ReactNode;
    /** Shows the "*" marker. */
    required?: boolean;
    full?: boolean;
    children: ReactNode;
};

/** A single control with its label. */
export function Field({ label, hint, required, full, children }: FieldProps) {
    return (
        <label className={cx(fieldClass, full && "col-span-full")}>
            <FieldLabel required={required}>{label}</FieldLabel>
            {children}
            {hint && <Hint>{hint}</Hint>}
        </label>
    );
}

/** For controls that aren't a single input (tag inputs, chip groups), so they can't sit inside a <label>. */
export function GroupField({
    labelId,
    label,
    hint,
    required,
    full = true,
    children,
}: FieldProps & { labelId: string }) {
    return (
        <div className={cx(fieldClass, full && "col-span-full")}>
            <FieldLabel id={labelId} required={required}>
                {label}
            </FieldLabel>
            {children}
            {hint && <Hint>{hint}</Hint>}
        </div>
    );
}
