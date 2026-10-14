import type {
    InputHTMLAttributes,
    ReactNode,
    SelectHTMLAttributes,
    TextareaHTMLAttributes,
} from "react";
import { Field } from "@/components/ui/field";
import { fieldInputClass } from "@/components/ui/styles";
import { cx } from "@/lib/cx";
import { useFieldContext } from "@/lib/form-context";
import { firstError } from "@/lib/format";

type Controlled = "value" | "defaultValue" | "onChange" | "onBlur" | "name";
type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, Controlled>;
type TextAreaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, Controlled>;
type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, Controlled> & {
    options: { value: string; label: string }[];
};

function useInvalid() {
    const field = useFieldContext();
    return field.state.meta.errors.length > 0 || undefined;
}

export function FieldError() {
    const field = useFieldContext();
    const message = firstError(field.state.meta.errors);
    if (!message) return null;
    return (
        <small role="alert" className="text-[0.75rem] leading-normal text-danger">
            {message}
        </small>
    );
}

export function TextInput({ className, ...props }: InputProps) {
    const field = useFieldContext<string>();
    return (
        <input
            name={field.name}
            className={cx(fieldInputClass, className)}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            aria-invalid={useInvalid()}
            {...props}
        />
    );
}

/** Empty input = `null` when `nullable`, otherwise `NaN` so validation can flag it. */
export function NumberInput({ className, nullable, ...props }: InputProps & { nullable?: boolean }) {
    const field = useFieldContext<number | null>();
    const value = field.state.value;
    return (
        <input
            type="number"
            name={field.name}
            className={cx(fieldInputClass, className)}
            value={value === null || Number.isNaN(value) ? "" : value}
            onChange={(e) =>
                field.handleChange(
                    e.target.value === "" ? (nullable ? null : NaN) : e.target.valueAsNumber,
                )
            }
            onBlur={field.handleBlur}
            aria-invalid={useInvalid()}
            {...props}
        />
    );
}

/** Native month pickers fall back to text inputs in some browsers; the pattern keeps that path valid. */
export function MonthInput({ className, ...props }: InputProps) {
    const field = useFieldContext<string | null>();
    return (
        <input
            type="month"
            placeholder="YYYY-MM"
            pattern="[0-9]{4}-[0-9]{2}"
            name={field.name}
            className={cx(fieldInputClass, className)}
            value={field.state.value ?? ""}
            onChange={(e) => field.handleChange(e.target.value || null)}
            onBlur={field.handleBlur}
            aria-invalid={useInvalid()}
            {...props}
        />
    );
}

/** A date input whose empty value is `null`. */
export function DateInput({ className, ...props }: InputProps) {
    const field = useFieldContext<string | null>();
    return (
        <input
            type="date"
            name={field.name}
            className={cx(fieldInputClass, className)}
            value={field.state.value ?? ""}
            onChange={(e) => field.handleChange(e.target.value || null)}
            onBlur={field.handleBlur}
            aria-invalid={useInvalid()}
            {...props}
        />
    );
}

export function TextArea({ className, ...props }: TextAreaProps) {
    const field = useFieldContext<string>();
    return (
        <textarea
            name={field.name}
            className={cx(fieldInputClass, className)}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            aria-invalid={useInvalid()}
            {...props}
        />
    );
}

/** Edits a list of strings as one line per item. */
export function LinesTextArea({ className, ...props }: TextAreaProps) {
    const field = useFieldContext<string[]>();
    return (
        <textarea
            name={field.name}
            className={cx(fieldInputClass, className)}
            value={field.state.value.join("\n")}
            onChange={(e) => field.handleChange(e.target.value.split("\n"))}
            onBlur={field.handleBlur}
            aria-invalid={useInvalid()}
            {...props}
        />
    );
}

export function Select({ className, options, ...props }: SelectProps) {
    const field = useFieldContext<string>();
    return (
        <select
            name={field.name}
            className={cx(fieldInputClass, className)}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            aria-invalid={useInvalid()}
            {...props}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}

type FieldLayout = { label: ReactNode; hint?: ReactNode; required?: boolean; full?: boolean };

export function TextField({ label, hint, required, full, ...props }: FieldLayout & InputProps) {
    return (
        <Field label={label} hint={hint} required={required} full={full}>
            <TextInput {...props} />
            <FieldError />
        </Field>
    );
}

export function TextAreaField({ label, hint, required, full, ...props }: FieldLayout & TextAreaProps) {
    return (
        <Field label={label} hint={hint} required={required} full={full}>
            <TextArea {...props} />
            <FieldError />
        </Field>
    );
}

export function MonthField({ label, hint, required, full, ...props }: FieldLayout & InputProps) {
    return (
        <Field label={label} hint={hint} required={required} full={full}>
            <MonthInput {...props} />
            <FieldError />
        </Field>
    );
}

export function SelectField({ label, hint, required, full, ...props }: FieldLayout & SelectProps) {
    return (
        <Field label={label} hint={hint} required={required} full={full}>
            <Select {...props} />
            <FieldError />
        </Field>
    );
}
