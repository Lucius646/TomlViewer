import { existsSync, mkdtempSync, readFileSync, rmSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { loadConfigDocument, saveKnownFields, saveKnownFieldsToPath } from "./document-service";
import { resolveGlobalConfigPath, resolveProjectConfigPath } from "./paths";

const tempDirectories: string[] = [];

afterEach(() => {
  for (const directory of tempDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("document service", () => {
  it("loads the current user's global config path on Windows", () => {
    expect(resolveGlobalConfigPath("C:/Users/lucius")).toBe("C:/Users/lucius/.codex/config.toml");
    expect(resolveProjectConfigPath("E:/LuciusProject/TomlViewer")).toBe(
      "E:/LuciusProject/TomlViewer/.codex/config.toml",
    );
  });

  it("preserves unknown keys when saving edited known fields", () => {
    const original = 'model = "gpt-5.4"\nunknown_key = "keep-me"\n[windows]\nsandbox = "unelevated"\n';

    const updated = saveKnownFields(original, {
      model: "gpt-5.4-mini",
      "windows.sandbox": "elevated",
    });

    expect(updated).toContain('unknown_key = "keep-me"');
    expect(updated).toContain('model = "gpt-5.4-mini"');
    expect(updated).toContain('sandbox = "elevated"');
  });

  it("rejects nested writes when an intermediate key is not an object", () => {
    const original = 'windows = "not-a-table"\n';

    expect(() =>
      saveKnownFields(original, {
        "windows.sandbox": "elevated",
      }),
    ).toThrow(/windows/i);
  });

  it("requires an expected mtime before overwriting an existing config file", () => {
    const directory = mkdtempSync(join(tmpdir(), "codex-config-service-"));
    const targetPath = join(directory, "config.toml");

    tempDirectories.push(directory);
    writeFileSync(targetPath, 'model = "gpt-5.4"\n', "utf8");

    expect(() =>
      saveKnownFieldsToPath({
        targetPath,
        knownFields: { model: "gpt-5.4-mini" },
      }),
    ).toThrow(/expected mtime/i);
  });

  it("creates a backup before writing an existing config file", () => {
    const directory = mkdtempSync(join(tmpdir(), "codex-config-service-"));
    const targetPath = join(directory, "config.toml");

    tempDirectories.push(directory);
    writeFileSync(targetPath, 'model = "gpt-5.4"\nunknown_key = "keep-me"\n', "utf8");

    const loaded = loadConfigDocument(targetPath);
    const result = saveKnownFieldsToPath({
      targetPath,
      knownFields: { model: "gpt-5.4-mini" },
      now: new Date("2026-03-22T08:00:00.000Z"),
      expectedMtimeMs: loaded.lastModifiedMs,
    });

    expect(result.backupPath).toBeDefined();
    expect(existsSync(result.backupPath!)).toBe(true);
    expect(readFileSync(result.backupPath!, "utf8")).toContain('model = "gpt-5.4"');
    expect(readFileSync(targetPath, "utf8")).toContain('unknown_key = "keep-me"');
    expect(readFileSync(targetPath, "utf8")).toContain('model = "gpt-5.4-mini"');
  });

  it("creates unique backup names when the timestamp collides", () => {
    const directory = mkdtempSync(join(tmpdir(), "codex-config-service-"));
    const targetPath = join(directory, "config.toml");
    const now = new Date("2026-03-22T08:00:00.000Z");

    tempDirectories.push(directory);
    writeFileSync(targetPath, 'model = "gpt-5.4"\n', "utf8");

    const firstLoaded = loadConfigDocument(targetPath);
    const firstSave = saveKnownFieldsToPath({
      targetPath,
      knownFields: { model: "gpt-5.4-mini" },
      now,
      expectedMtimeMs: firstLoaded.lastModifiedMs,
    });
    const secondLoaded = loadConfigDocument(targetPath);
    const secondSave = saveKnownFieldsToPath({
      targetPath,
      knownFields: { model: "gpt-5.4" },
      now,
      expectedMtimeMs: secondLoaded.lastModifiedMs,
    });

    expect(firstSave.backupPath).not.toBe(secondSave.backupPath);
    expect(existsSync(firstSave.backupPath!)).toBe(true);
    expect(existsSync(secondSave.backupPath!)).toBe(true);
  });

  it("rejects saving when the file changed after it was loaded", () => {
    const directory = mkdtempSync(join(tmpdir(), "codex-config-service-"));
    const targetPath = join(directory, "config.toml");

    tempDirectories.push(directory);
    writeFileSync(targetPath, 'model = "gpt-5.4"\n', "utf8");

    const loaded = loadConfigDocument(targetPath);
    const nextModifiedAt = new Date((loaded.lastModifiedMs ?? Date.now()) + 2000);

    writeFileSync(targetPath, 'model = "gpt-5.4-mini"\n', "utf8");
    utimesSync(targetPath, nextModifiedAt, nextModifiedAt);

    expect(() =>
      saveKnownFieldsToPath({
        targetPath,
        knownFields: { model: "gpt-5.4" },
        expectedMtimeMs: loaded.lastModifiedMs,
      }),
    ).toThrow(/changed/i);
  });
});