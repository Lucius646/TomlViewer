import type { TomlDocument } from "./toml-document";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function setValueAtKeyPath(target: TomlDocument, keyPath: string, value: unknown) {
  const segments = keyPath.split(".");
  const lastSegment = segments.pop();

  if (!lastSegment) {
    return;
  }

  let current: Record<string, unknown> = target;

  for (const segment of segments) {
    const nextValue = current[segment];

    if (!isObject(nextValue)) {
      current[segment] = {};
    }

    current = current[segment] as Record<string, unknown>;
  }

  current[lastSegment] = value;
}

export function mergeKnownFields(document: TomlDocument, editedKnownFields: Record<string, unknown>) {
  const mergedDocument = structuredClone(document);

  for (const [keyPath, value] of Object.entries(editedKnownFields)) {
    setValueAtKeyPath(mergedDocument, keyPath, value);
  }

  return mergedDocument;
}