import { useFieldContext } from "@/components/form/form-context";

type TextFieldProps = {
  label: string,
  placeholder?: string,
  required?: boolean,
  disabled?: boolean,
}

export function TextField({ label, placeholder = "", required = true, disabled = false }: TextFieldProps) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <div aria-disabled={disabled}>
      <label htmlFor={field.name}>
        {label} {required && <p className="text-destructive pb-0 mb-0">*</p>}
      </label>
      <input
        name={field.name}
        className=""
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        required={required}
        aria-invalid={isInvalid}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
    // {isInvalid && <p> {field.state.meta.errors} <p />}
  );
}
