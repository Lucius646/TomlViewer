import { describe, expect, it } from "vitest";

import { fieldRegistry } from "./registry";

describe("fieldRegistry", () => {
  it("defines structured and dynamic metadata for key config fields", () => {
    const modelField = fieldRegistry.find((item) => item.keyPath === "model");
    const approvalPolicyField = fieldRegistry.find((item) => item.keyPath === "approval_policy");
    const modelProviderField = fieldRegistry.find((item) => item.keyPath === "model_provider");
    const projectDocField = fieldRegistry.find((item) => item.keyPath === "project_doc_max_bytes");

    expect(modelField?.label).toBe("主模型");
    expect(modelField?.recommendedScope).toBe("global");
    expect(modelField?.allowedValues).toContain("gpt-5.4");
    expect(modelField?.defaultBehavior).toContain("gpt-5.4");

    expect(approvalPolicyField?.structuredValue?.shape).toBe("object");
    expect(approvalPolicyField?.structuredValue?.fields?.[0]?.keyPath).toBe("granular");

    expect(modelProviderField?.dynamicOptionsSource).toBe("model_providers");

    expect(projectDocField?.sectionId).toBe("search-experience");
    expect(projectDocField?.defaultValue).toBe(32768);
  });
});