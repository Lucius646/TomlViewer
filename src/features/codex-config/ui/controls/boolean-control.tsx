import { Controller, type Control } from "react-hook-form";

interface BooleanControlProps {
  control: Control<Record<string, unknown>>;
  name: string;
  label: string;
}

export function BooleanControl({ control, name, label }: BooleanControlProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <label className="field-control field-control--checkbox">
          <input
            aria-label={label}
            checked={Boolean(field.value)}
            className="field-control__checkbox"
            type="checkbox"
            onBlur={field.onBlur}
            onChange={(event) => field.onChange(event.target.checked)}
          />
          <span className="field-control__label">{label}</span>
        </label>
      )}
    />
  );
}