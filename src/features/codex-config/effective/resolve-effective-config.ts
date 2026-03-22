import { fieldRegistry } from "../metadata/registry";

export type EffectiveValueSource = "project" | "global" | "default" | "unset";

export interface EffectiveConfigEntry {
  value: unknown;
  source: EffectiveValueSource;
}

function cloneResolvedValue(value: unknown) {
  if (typeof value === "object" && value !== null) {
    return structuredClone(value);
  }

  return value;
}

function getValueAtKeyPath(source: Record<string, unknown>, keyPath: string) {
  if (Object.prototype.hasOwnProperty.call(source, keyPath)) {
    return source[keyPath];
  }

  const segments = keyPath.split(".");
  let current: unknown = source;

  for (const segment of segments) {
    if (typeof current !== "object" || current === null || Array.isArray(current)) {
      return undefined;
    }

    if (!Object.prototype.hasOwnProperty.call(current, segment)) {
      return undefined;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return current;
}

export function resolveEffectiveConfig(
  globalValues: Record<string, unknown>,
  projectValues: Record<string, unknown>,
): Record<string, EffectiveConfigEntry> {
  const resolvedEntries: Record<string, EffectiveConfigEntry> = {};

  for (const field of fieldRegistry) {
    const projectValue = getValueAtKeyPath(projectValues, field.keyPath);
    const globalValue = getValueAtKeyPath(globalValues, field.keyPath);

    if (projectValue !== undefined) {
      resolvedEntries[field.keyPath] = { value: projectValue, source: "project" };
      continue;
    }

    if (globalValue !== undefined) {
      resolvedEntries[field.keyPath] = { value: globalValue, source: "global" };
      continue;
    }

    if (field.defaultValue !== undefined) {
      resolvedEntries[field.keyPath] = {
        value: cloneResolvedValue(field.defaultValue),
        source: "default",
      };
      continue;
    }

    resolvedEntries[field.keyPath] = { value: undefined, source: "unset" };
  }

  return resolvedEntries;
}