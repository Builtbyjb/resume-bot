import { useFieldContext } from "@/components/form/form-context";
import { Field, FieldLabel, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns"

type BaseFieldProps = {
  label: string,
  required?: boolean,
  disabled?: boolean,
}

type TextFieldProps = {
  placeholder?: string,
} & BaseFieldProps

export function TextField({ label, placeholder = "", required = true, disabled = false }: TextFieldProps) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field aria-disabled={disabled}>
      <FieldLabel htmlFor={field.name}>
        {label} {required && <p className="text-destructive pb-0 mb-0">*</p>}
      </FieldLabel>
      <Input
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
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}

type DateFieldProps = BaseFieldProps

export function DateField({ label, required = true, disabled = false }: DateFieldProps) {
  const field = useFieldContext<Date>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  return (
    <Field>
      <FieldLabel htmlFor={field.name}>
        {label} {required && <p className="text-destructive pb-0 mb-0">*</p>}
      </FieldLabel>
      <Popover>
        <PopoverTrigger render={
          <Button variant="outline" id="date-picker" className="justify-start">
            {field.state.value ? format(field.state.value, "PPP") : <span>Pick a date</span>}
          </Button>
        } />
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.state.value}
            onSelect={(e: Date) => field.handleChange(e || null)}
            defaultMonth={field.state.value}
            required
          />
        </PopoverContent>
      </Popover>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
