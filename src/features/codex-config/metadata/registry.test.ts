import { describe, expect, it } from "vitest";

import { fieldRegistry } from "./registry";

describe("fieldRegistry", () => {
  it("defines the model field with Chinese description and global scope guidance", () => {
    const field = fieldRegistry.find((item) => item.keyPath === "model");

    expect(field?.label).toBe("主模型");
    expect(field?.recommendedScope).toBe("global");
    expect(field?.allowedValues).toContain("gpt-5.4");
  });
});
