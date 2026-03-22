import type { Control } from "react-hook-form";

import type { EffectiveConfigEntry } from "../effective/resolve-effective-config";
import type { ConfigFieldDefinition } from "../types";
import { FieldCard } from "./field-card";
import { BooleanControl } from "./controls/boolean-control";
import { SelectControl } from "./controls/select-control";
import { TextControl } from "./controls/text-control";

interface SectionEditorProps {
  control: Control<Record<string, unknown>>;
  currentValues: Record<string, unknown>;
  effectiveValues: Record<string, EffectiveConfigEntry>;
  fields: readonly ConfigFieldDefinition[];
  isLoading: boolean;
}

function renderControl(field: ConfigFieldDefinition, control: Control<Record<string, unknown>>) {
  switch (field.kind) {
    case "enum":
      return field.allowedValues ? (
        <SelectControl control={control} name={field.keyPath} label={field.label} options={field.allowedValues} />
      ) : null;
    case "string":
      return <TextControl control={control} name={field.keyPath} label={field.label} />;
    case "number":
      return <TextControl control={control} name={field.keyPath} label={field.label} inputMode="numeric" />;
    case "boolean":
      return <BooleanControl control={control} name={field.keyPath} label={field.label} />;
    default:
      return <p className="field-control__unsupported">这个字段会在后续任务里升级为专用编辑器。</p>;
  }
}

export function SectionEditor({ control, currentValues, effectiveValues, fields, isLoading }: SectionEditorProps) {
  if (isLoading) {
    return <div className="section-editor__empty">正在读取当前配置…</div>;
  }

  return (
    <div className="config-editor__field-list">
      {fields.map((field) => (
        <FieldCard
          key={field.keyPath}
          field={field}
          effectiveEntry={effectiveValues[field.keyPath]}
          currentValue={currentValues[field.keyPath]}
        >
          {renderControl(field, control)}
        </FieldCard>
      ))}
    </div>
  );
}