import { homedir } from "node:os";

import { NextResponse } from "next/server";

import type { ConfigApiPayload, ConfigApiRequest, ConfigApiScope } from "@/features/codex-config/api/contracts";
import { resolveEffectiveConfig } from "@/features/codex-config/effective/resolve-effective-config";
import { listBackupPaths } from "@/features/codex-config/io/backup";
import {
  extractKnownFields,
  loadConfigDocument,
  saveKnownFieldsToPath,
  saveRawTomlToPath,
} from "@/features/codex-config/io/document-service";
import { resolveGlobalConfigPath, resolveProjectConfigPath } from "@/features/codex-config/io/paths";
import { validateKnownFields } from "@/features/codex-config/validation/schema";

export const runtime = "nodejs";

function getUserHomeDirectory() {
  return process.env.USERPROFILE ?? process.env.HOME ?? homedir();
}

function resolveTargetPath(scope: ConfigApiScope, projectPath?: string) {
  if (scope === "global") {
    return resolveGlobalConfigPath(getUserHomeDirectory());
  }

  if (!projectPath) {
    throw new Error("projectPath is required when scope=project");
  }

  return resolveProjectConfigPath(projectPath);
}

function buildPayload(scope: ConfigApiScope, targetPath: string, backupPath?: string): ConfigApiPayload {
  const loadedDocument = loadConfigDocument(targetPath);
  const knownFields = validateKnownFields(extractKnownFields(loadedDocument.parsed));
  const globalTargetPath = resolveGlobalConfigPath(getUserHomeDirectory());
  const globalKnownFields =
    scope === "global" ? knownFields : validateKnownFields(extractKnownFields(loadConfigDocument(globalTargetPath).parsed));

  return {
    scope,
    targetPath,
    exists: loadedDocument.exists,
    rawToml: loadedDocument.rawToml,
    knownFields,
    effectiveValues: resolveEffectiveConfig(globalKnownFields, scope === "project" ? knownFields : {}),
    backups: listBackupPaths(targetPath),
    lastModifiedMs: loadedDocument.lastModifiedMs,
    backupPath,
  };
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function serverError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown server error";
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope");

    if (scope !== "global" && scope !== "project") {
      return badRequest("scope must be global or project");
    }

    const targetPath = resolveTargetPath(scope, searchParams.get("projectPath") ?? undefined);

    return NextResponse.json(buildPayload(scope, targetPath));
  } catch (error) {
    if (error instanceof Error && error.message.includes("projectPath")) {
      return badRequest(error.message);
    }

    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ConfigApiRequest;

    if (body.scope !== "global" && body.scope !== "project") {
      return badRequest("scope must be global or project");
    }

    if (body.mode !== "visual" && body.mode !== "expert") {
      return badRequest("mode must be visual or expert");
    }

    const targetPath = resolveTargetPath(body.scope, body.projectPath);

    const result =
      body.mode === "expert"
        ? saveRawTomlToPath({
            targetPath,
            rawToml: body.rawToml ?? "",
            expectedMtimeMs: body.expectedMtimeMs,
          })
        : saveKnownFieldsToPath({
            targetPath,
            knownFields: validateKnownFields(body.knownFields ?? {}),
            expectedMtimeMs: body.expectedMtimeMs,
          });

    return NextResponse.json(buildPayload(body.scope, targetPath, result.backupPath));
  } catch (error) {
    if (error instanceof Error && error.message.includes("projectPath")) {
      return badRequest(error.message);
    }

    if (error instanceof Error && error.message.includes("scope must") || error instanceof Error && error.message.includes("mode must")) {
      return badRequest(error.message);
    }

    if (error instanceof Error && error.message.includes("expected mtime")) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return serverError(error);
  }
}