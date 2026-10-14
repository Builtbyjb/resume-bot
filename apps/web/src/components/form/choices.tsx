import type { ReactNode } from "react";
import { SettingLabel } from "@/components/ui/card";
import { cx } from "@/lib/cx";
import { useFieldContext } from "@/lib/form-context";

type Option<T extends string> = { value: T; label: string };

export function Switch({ id }: { id: string }) {
    const field = useFieldContext<boolean>();
    return (
        <input
            type="checkbox"
            role="switch"
            id={id}
            name={field.name}
            checked={field.state.value}
            onChange={(e) => field.handleChange(e.target.checked)}
            onBlur={field.handleBlur}
            className="relative m-0 h-6 w-[42px] shrink-0 cursor-pointer appearance-none rounded-full bg-muted/20 transition-[background-color] duration-200 before:absolute before:top-[3px] before:left-[3px] before:size-[18px] before:rounded-full before:bg-white before:transition-transform before:duration-200 before:content-[''] checked:bg-accent checked:before:translate-x-[18px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
    );
}

export function Checkbox({ children }: { children: ReactNode }) {
    const field = useFieldContext<boolean>();
    return (
        <label className="inline-flex cursor-pointer items-center gap-2 text-[0.85rem] text-muted">
            <input
                type="checkbox"
                name={field.name}
                checked={field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
                onBlur={field.handleBlur}
                className="m-0 size-4 accent-accent"
            />
            {children}
        </label>
    );
}

/** Multi-select chips. Values keep the order of `options`. */
export function ChipGroup<T extends string>({
    labelId,
    options,
}: {
    labelId: string;
    options: Option<T>[];
}) {
    const field = useFieldContext<T[]>();
    const selected = field.state.value;

    const toggle = (value: T, checked: boolean) =>
        field.handleChange(
            options
                .map((option) => option.value)
                .filter((v) => (v === value ? checked : selected.includes(v))),
        );

    return (
        <div role="group" aria-labelledby={labelId} className="flex flex-wrap gap-[0.4rem]">
            {options.map((option) => (
                <label key={option.value} className="relative cursor-pointer">
                    <input
                        type="checkbox"
                        name={field.name}
                        value={option.value}
                        checked={selected.includes(option.value)}
                        onChange={(e) => toggle(option.value, e.target.checked)}
                        onBlur={field.handleBlur}
                        className="peer absolute inset-0 m-0 cursor-pointer opacity-0"
                    />
                    <span className="inline-flex min-w-[2.9rem] items-center justify-center rounded-lg border border-muted/25 px-[0.6rem] py-[0.4rem] text-[0.8rem] text-muted transition-[background-color,border-color,color] duration-150 peer-checked:border-accent peer-checked:bg-accent peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                        {option.label}
                    </span>
                </label>
            ))}
        </div>
    );
}

/** Radio options rendered as selectable cards with a description. */
export function RadioCards<T extends string>({
    options,
    labelId,
    ariaLabel,
    flush,
}: {
    options: (Option<T> & { description: string })[];
    labelId?: string;
    ariaLabel?: string;
    /** Drops the card-row padding and divider when used inside a field. */
    flush?: boolean;
}) {
    const field = useFieldContext<T>();
    return (
        <div
            role="radiogroup"
            aria-labelledby={labelId}
            aria-label={ariaLabel}
            className={cx(
                "grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[0.6rem]",
                !flush && "border-t border-muted/8 px-6 pt-[1.1rem] pb-[1.4rem]",
            )}
        >
            {options.map((option) => (
                <label
                    key={option.value}
                    className="flex cursor-pointer items-start gap-[0.7rem] rounded-xl border border-muted/15 px-4 py-[0.8rem] transition-[border-color,background-color] duration-150 has-checked:border-accent has-checked:bg-accent/8 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent"
                >
                    <input
                        type="radio"
                        name={field.name}
                        value={option.value}
                        checked={field.state.value === option.value}
                        onChange={() => field.handleChange(option.value)}
                        onBlur={field.handleBlur}
                        className="mx-0 mt-[0.3rem] mb-0 accent-accent"
                    />
                    <SettingLabel as="span" title={option.label} description={option.description} />
                </label>
            ))}
        </div>
    );
}

/** A Yes / No question. `null` means unanswered. */
export function YesNo({ labelId }: { labelId: string }) {
    const field = useFieldContext<boolean | null>();
    const choices = [
        { value: true, label: "Yes" },
        { value: false, label: "No" },
    ];
    return (
        <div
            role="radiogroup"
            aria-labelledby={labelId}
            className="inline-flex self-start overflow-hidden rounded-[10px] border border-muted/25"
        >
            {choices.map((choice) => (
                <label
                    key={choice.label}
                    className="relative cursor-pointer [&+label]:border-l [&+label]:border-muted/25"
                >
                    <input
                        type="radio"
                        name={field.name}
                        value={choice.label.toLowerCase()}
                        checked={field.state.value === choice.value}
                        onChange={() => field.handleChange(choice.value)}
                        onBlur={field.handleBlur}
                        className="peer absolute inset-0 m-0 cursor-pointer opacity-0"
                    />
                    <span className="block px-[1.1rem] py-[0.45rem] text-[0.85rem] text-muted transition-[background-color,color] duration-150 peer-checked:bg-accent peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-2 peer-focus-visible:outline-accent">
                        {choice.label}
                    </span>
                </label>
            ))}
        </div>
    );
}
