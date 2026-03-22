import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { resolveGlobalConfigPath } from "@/features/codex-config/io/paths";
import { GET, POST } from "./route";

const tempDirectories: string[] = [];
const originalUserProfile = process.env.USERPROFILE;

afterEach(() => {
  process.env.USERPROFILE = originalUserProfile;

  for (const directory of tempDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("config route", () => {
  beforeEach(() => {
    const userHome = mkdtempSync(join(tmpdir(), "codex-config-api-"));
    const globalConfigPath = resolveGlobalConfigPath(userHome);

    tempDirectories.push(userHome);
    process.env.USERPROFILE = userHome;
    mkdirSync(dirname(globalConfigPath), { recursive: true });
    writeFileSync(globalConfigPath, 'model = "gpt-5.4"\n', "utf8");
  });

  it("returns the requested global config payload", async () => {
    const response = await GET(new Request("http://localhost/api/config?scope=global"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.scope).toBe("global");
    expect(payload.knownFields.model).toBe("gpt-5.4");
    expect(payload.effectiveValues.model.source).toBe("global");
  });

  it("saves edited known fields for the requested global scope", async () => {
    const getResponse = await GET(new Request("http://localhost/api/config?scope=global"));
    const currentPayload = await getResponse.json();
    const saveResponse = await POST(
      new Request("http://localhost/api/config", {
        method: "POST",
        body: JSON.stringify({
          scope: "global",
          knownFields: { model: "gpt-5.4-mini" },
          mode: "visual",
          expectedMtimeMs: currentPayload.lastModifiedMs,
        }),
        headers: {
          "content-type": "application/json",
        },
      }),
    );
    const savedPayload = await saveResponse.json();
    const globalConfigPath = resolveGlobalConfigPath(process.env.USERPROFILE!);

    expect(saveResponse.status).toBe(200);
    expect(savedPayload.knownFields.model).toBe("gpt-5.4-mini");
    expect(readFileSync(globalConfigPath, "utf8")).toContain('model = "gpt-5.4-mini"');
  });
});