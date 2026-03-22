import { describe, expect, it } from "vitest";

import { fieldRegistry } from "./registry";

describe("fieldRegistry", () => {
  it("defines the model field with Chinese description and global scope guidance", () => {
    const field = fieldRegistry.find((item) => item.keyPath === "model");
    const projectDocField = fieldRegistry.find((item) => item.keyPath === "project_doc_max_bytes");
    const projectTrustField = fieldRegistry.find((item) => item.keyPath === "projects");

    expect(field?.label).toBe("主模型");
    expect(field?.recommendedScope).toBe("global");
    expect(field?.allowedValues).toContain("gpt-5.4");
    expect(field?.defaultBehavior).toContain("gpt-5.4");
    expect(projectDocField?.sectionId).toBe("search-experience");
    expect(projectTrustField?.sectionId).toBe("project-trust");
  });
});
