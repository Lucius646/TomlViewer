import { Controller, type Control } from "react-hook-form";

interface TextControlProps {
  control: Control<Record<string, unknown>>;
  name: string;
  label: string;
  inputMode?: "text" | "numeric";
}

export function TextControl({ control, name, label, inputMode = "text" }: TextControlProps) {
  return (
    <label className="field-control">
      <span className="field-control__label">{label}</span>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <input
            aria-label={label}
            className="field-control__input"
            inputMode={inputMode}
            value={typeof field.value === "number" ? String(field.value) : typeof field.value === "string" ? field.value : ""}
            onBlur={field.onBlur}
            onChange={(event) => {
              const nextValue = event.target.value;
              field.onChange(inputMode === "numeric" ? (nextValue === "" ? undefined : Number(nextValue)) : nextValue);
            }}
          />
        )}
      />
    </label>
  );
}