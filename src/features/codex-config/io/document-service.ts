import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import { createBackupIfExists } from "./backup";
import { mergeKnownFields } from "./merge-known-fields";
import { parseTomlDocument, stringifyTomlDocument } from "./toml-document";

export interface LoadedConfigDocument {
  targetPath: string;
  exists: boolean;
  rawToml: string;
  parsed: Record<string, unknown>;
}

export interface SaveKnownFieldsToPathParams {
  targetPath: string;
  knownFields: Record<string, unknown>;
  now?: Date;
}

export interface SaveKnownFieldsToPathResult {
  backupPath?: string;
  rawToml: string;
}

export function loadConfigDocument(targetPath: string): LoadedConfigDocument {
  const exists = existsSync(targetPath);
  const rawToml = exists ? readFileSync(targetPath, "utf8") : "";

  return {
    targetPath,
    exists,
    rawToml,
    parsed: parseTomlDocument(rawToml),
  };
}

export function saveKnownFields(source: string, knownFields: Record<string, unknown>) {
  const parsedDocument = parseTomlDocument(source);
  const mergedDocument = mergeKnownFields(parsedDocument, knownFields);

  return stringifyTomlDocument(mergedDocument);
}

export function saveKnownFieldsToPath({
  targetPath,
  knownFields,
  now = new Date(),
}: SaveKnownFieldsToPathParams): SaveKnownFieldsToPathResult {
  const source = existsSync(targetPath) ? readFileSync(targetPath, "utf8") : "";
  const rawToml = saveKnownFields(source, knownFields);
  const backupPath = createBackupIfExists(targetPath, now) ?? undefined;

  mkdirSync(dirname(targetPath), { recursive: true });
  writeFileSync(targetPath, rawToml, "utf8");

  return {
    backupPath,
    rawToml,
  };
}