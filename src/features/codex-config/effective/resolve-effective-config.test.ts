import { describe, expect, it } from "vitest";

import { resolveEffectiveConfig } from "./resolve-effective-config";
import { validateKnownFields } from "../validation/schema";

describe("known field validation", () => {
  it("rejects invalid sandbox_mode values", () => {
    expect(() => validateKnownFields({ sandbox_mode: "unsafe-mode" })).toThrow(/sandbox_mode/i);
  });

  it("accepts structured approval_policy values", () => {
    expect(
      validateKnownFields({
        approval_policy: { granular: { sandbox_approval: true } },
      }).approval_policy,
    ).toEqual({ granular: { sandbox_approval: true } });
  });
});

describe("resolveEffectiveConfig", () => {
  it("reports project values as overriding global values", () => {
    const resolved = resolveEffectiveConfig(
      { model: "gpt-5.4", "windows.sandbox": "unelevated" },
      { model: "gpt-5.4-mini" },
    );

    expect(resolved.model.source).toBe("project");
    expect(resolved.model.value).toBe("gpt-5.4-mini");
    expect(resolved["windows.sandbox"].source).toBe("global");
  });

  it("falls back to registry defaults when neither scope sets a value", () => {
    const resolved = resolveEffectiveConfig({}, {});

    expect(resolved.sandbox_mode.source).toBe("default");
    expect(resolved.sandbox_mode.value).toBe("read-only");
  });
});