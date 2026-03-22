import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import { createBackupIfExists } from "./backup";
import { mergeKnownFields } from "./merge-known-fields";
import { parseTomlDocument, stringifyTomlDocument } from "./toml-document";

function createTempWritePath(targetPath: string, now: Date) {
  return `${targetPath}.tmp.${process.pid}.${now.getTime()}`;
}

function replaceFileFromTemp(targetPath: string, rawToml: string, now: Date) {
  const tempPath = createTempWritePath(targetPath, now);

  writeFileSync(tempPath, rawToml, "utf8");

  try {
    if (existsSync(targetPath)) {
      rmSync(targetPath);
    }

    renameSync(tempPath, targetPath);
  } catch (error) {
    if (existsSync(tempPath)) {
      rmSync(tempPath, { force: true });
    }

    throw error;
  }
}

function assertExpectedMtime(targetPath: string, expectedMtimeMs?: number) {
  if (expectedMtimeMs === undefined) {
    return;
  }

  if (!existsSync(targetPath)) {
    throw new Error(`Config file changed before save: ${targetPath}`);
  }

  const currentMtimeMs = statSync(targetPath).mtimeMs;

  if (currentMtimeMs !== expectedMtimeMs) {
    throw new Error(`Config file changed before save: ${targetPath}`);
  }
}

export interface LoadedConfigDocument {
  targetPath: string;
  exists: boolean;
  rawToml: string;
  parsed: Record<string, unknown>;
  lastModifiedMs?: number;
}

export interface SaveKnownFieldsToPathParams {
  targetPath: string;
  knownFields: Record<string, unknown>;
  now?: Date;
  expectedMtimeMs?: number;
}

export interface SaveKnownFieldsToPathResult {
  backupPath?: string;
  rawToml: string;
  lastModifiedMs: number;
}

export function loadConfigDocument(targetPath: string): LoadedConfigDocument {
  const exists = existsSync(targetPath);
  const rawToml = exists ? readFileSync(targetPath, "utf8") : "";
  const lastModifiedMs = exists ? statSync(targetPath).mtimeMs : undefined;

  return {
    targetPath,
    exists,
    rawToml,
    parsed: parseTomlDocument(rawToml),
    lastModifiedMs,
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
  expectedMtimeMs,
}: SaveKnownFieldsToPathParams): SaveKnownFieldsToPathResult {
  mkdirSync(dirname(targetPath), { recursive: true });
  assertExpectedMtime(targetPath, expectedMtimeMs);

  const source = existsSync(targetPath) ? readFileSync(targetPath, "utf8") : "";
  const rawToml = saveKnownFields(source, knownFields);
  const backupPath = createBackupIfExists(targetPath, now) ?? undefined;

  replaceFileFromTemp(targetPath, rawToml, now);

  return {
    backupPath,
    rawToml,
    lastModifiedMs: statSync(targetPath).mtimeMs,
  };
}