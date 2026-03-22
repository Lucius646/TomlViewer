import { Controller, type Control } from "react-hook-form";

interface SelectControlProps {
  control: Control<Record<string, unknown>>;
  name: string;
  label: string;
  options: readonly string[];
}

export function SelectControl({ control, name, label, options }: SelectControlProps) {
  return (
    <label className="field-control">
      <span className="field-control__label">{label}</span>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <select
            aria-label={label}
            className="field-control__input"
            value={typeof field.value === "string" ? field.value : ""}
            onBlur={field.onBlur}
            onChange={(event) => field.onChange(event.target.value || undefined)}
          >
            <option value="">未设置</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
      />
    </label>
  );
}