export type ConfigScope = "global" | "project" | "either";

export type ConfigFieldKind = "string" | "number" | "boolean" | "enum" | "array" | "object";

export type ConfigFieldRisk = "normal" | "warning" | "danger";

export type ConfigDynamicOptionsSource = "profiles" | "model_providers";

export type ConfigSectionId =
  | "core-model"
  | "reasoning-output"
  | "security-sandbox"
  | "search-experience"
  | "history-notifications"
  | "profiles"
  | "model-providers"
  | "project-trust"
  | "expert-mode";

export interface ConfigSectionDefinition {
  id: ConfigSectionId;
  label: string;
  description: string;
}

export interface ConfigFieldDefinition {
  keyPath: string;
  sectionId: ConfigSectionId;
  label: string;
  description: string;
  defaultBehavior: string;
  recommendedScope: ConfigScope;
  kind: ConfigFieldKind;
  allowedValues?: readonly string[];
  risk?: ConfigFieldRisk;
  defaultValue?: string | number | boolean | readonly string[] | Record<string, unknown>;
  supportsStructuredValue?: boolean;
  structuredValueDescription?: string;
  dynamicOptionsSource?: ConfigDynamicOptionsSource;
}