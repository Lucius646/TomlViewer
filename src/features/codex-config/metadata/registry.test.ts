import { describe, expect, it } from "vitest";

import { fieldRegistry } from "./registry";

describe("fieldRegistry", () => {
  it("defines machine-readable metadata for core and structured config fields", () => {
    const field = fieldRegistry.find((item) => item.keyPath === "model");
    const approvalPolicyField = fieldRegistry.find((item) => item.keyPath === "approval_policy") as
      | (Record<string, any> & { sectionId?: string })
      | undefined;
    const modelProviderField = fieldRegistry.find((item) => item.keyPath === "model_provider") as
      | (Record<string, any> & { sectionId?: string })
      | undefined;
    const projectDocField = fieldRegistry.find((item) => item.keyPath === "project_doc_max_bytes");
    const projectTrustField = fieldRegistry.find((item) => item.keyPath === "projects") as
      | (Record<string, any> & { sectionId?: string })
      | undefined;

    expect(field?.label).toBe("主模型");
    expect(field?.recommendedScope).toBe("global");
    expect(field?.allowedValues).toContain("gpt-5.4");
    expect(field?.defaultBehavior).toContain("gpt-5.4");

    expect(approvalPolicyField?.structuredValue?.shape).toBe("object");
    expect(approvalPolicyField?.structuredValue?.fields?.[0]?.keyPath).toBe("granular");
    expect(approvalPolicyField?.structuredValue?.fields?.[0]?.fields?.[0]?.keyPath).toBe("sandbox_approval");

    expect(modelProviderField?.dynamicOptionsSource).toBe("model_providers");

    expect(projectDocField?.sectionId).toBe("search-experience");
    expect(projectTrustField?.sectionId).toBe("project-trust");
    expect(projectTrustField?.structuredValue?.shape).toBe("map");
    expect(projectTrustField?.structuredValue?.mapValue?.keyPath).toBe("trust_level");
    expect(projectTrustField?.structuredValue?.mapValue?.allowedValues).toContain("trusted");
  });
});