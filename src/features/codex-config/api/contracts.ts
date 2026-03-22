import type { EffectiveConfigEntry } from "../effective/resolve-effective-config";

export type ConfigApiScope = "global" | "project";
export type ConfigSaveMode = "visual" | "expert";

export interface ConfigApiPayload {
  scope: ConfigApiScope;
  targetPath: string;
  exists: boolean;
  rawToml: string;
  knownFields: Record<string, unknown>;
  effectiveValues: Record<string, EffectiveConfigEntry>;
  backups: string[];
  lastModifiedMs?: number;
  backupPath?: string;
}

export interface ConfigApiRequest {
  scope: ConfigApiScope;
  projectPath?: string;
  knownFields?: Record<string, unknown>;
  rawToml?: string;
  mode: ConfigSaveMode;
  expectedMtimeMs?: number;
}