import { describe, expect, it } from "vitest";

import { fieldRegistry } from "./registry";

describe("fieldRegistry", () => {
  it("defines the model field with Chinese description and global scope guidance", () => {
    const field = fieldRegistry.find((item) => item.keyPath === "model");
    const approvalPolicyField = fieldRegistry.find((item) => item.keyPath === "approval_policy") as
      | (Record<string, unknown> & { sectionId?: string })
      | undefined;
    const modelProviderField = fieldRegistry.find((item) => item.keyPath === "model_provider") as
      | (Record<string, unknown> & { sectionId?: string })
      | undefined;
    const projectDocField = fieldRegistry.find((item) => item.keyPath === "project_doc_max_bytes");
    const projectTrustField = fieldRegistry.find((item) => item.keyPath === "projects") as
      | (Record<string, unknown> & { sectionId?: string })
      | undefined;

    expect(field?.label).toBe("主模型");
    expect(field?.recommendedScope).toBe("global");
    expect(field?.allowedValues).toContain("gpt-5.4");
    expect(field?.defaultBehavior).toContain("gpt-5.4");
    expect(approvalPolicyField?.structuredValueDescription).toEqual(expect.stringContaining("granular"));
    expect(modelProviderField?.dynamicOptionsSource).toBe("model_providers");
    expect(projectDocField?.sectionId).toBe("search-experience");
    expect(projectTrustField?.sectionId).toBe("project-trust");
    expect(projectTrustField?.structuredValueDescription).toEqual(expect.stringContaining("trust_level"));
  });
});