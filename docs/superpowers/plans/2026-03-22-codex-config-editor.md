# Codex 配置编辑器实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个仅支持 Windows 的本地 Next.js Web 应用，用元数据驱动的可视化界面编辑 Codex 全局/项目 `config.toml`，并提供中文字段说明与专家模式原始 TOML 兜底编辑能力。

**Architecture:** 使用单个 Next.js App Router 应用，并通过本地 route handler 访问文件系统。配置知识集中放在字段元数据注册表，文件解析/备份/回写逻辑集中在文档服务，UI 仅负责说明展示、表单渲染与保存交互。保存时先将已编辑的已知字段与原文档中的未知字段合并，再序列化回 TOML。

**Tech Stack:** Next.js、React、TypeScript、React Hook Form、Zod、`@iarna/toml`、Vitest、Testing Library

---

## 计划中的文件结构

### 应用基础壳

- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next-env.d.ts`
- Create: `next.config.ts`
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Create: `src/test/setup.ts`

### 配置领域层

- Create: `src/features/codex-config/types.ts`
- Create: `src/features/codex-config/metadata/registry.ts`
- Create: `src/features/codex-config/metadata/sections.ts`
- Create: `src/features/codex-config/metadata/defaults.ts`
- Create: `src/features/codex-config/validation/schema.ts`
- Create: `src/features/codex-config/effective/resolve-effective-config.ts`

### 文件 I/O 与 TOML 处理层

- Create: `src/features/codex-config/io/paths.ts`
- Create: `src/features/codex-config/io/backup.ts`
- Create: `src/features/codex-config/io/toml-document.ts`
- Create: `src/features/codex-config/io/merge-known-fields.ts`
- Create: `src/features/codex-config/io/document-service.ts`

### API 层

- Create: `src/app/api/config/route.ts`
- Create: `src/features/codex-config/api/contracts.ts`

### UI 层

- Create: `src/features/codex-config/ui/config-editor-app.tsx`
- Create: `src/features/codex-config/ui/mode-switcher.tsx`
- Create: `src/features/codex-config/ui/section-sidebar.tsx`
- Create: `src/features/codex-config/ui/field-card.tsx`
- Create: `src/features/codex-config/ui/right-panel.tsx`
- Create: `src/features/codex-config/ui/section-editor.tsx`
- Create: `src/features/codex-config/ui/controls/text-control.tsx`
- Create: `src/features/codex-config/ui/controls/select-control.tsx`
- Create: `src/features/codex-config/ui/controls/boolean-control.tsx`
- Create: `src/features/codex-config/ui/collections/profile-editor.tsx`
- Create: `src/features/codex-config/ui/collections/model-provider-editor.tsx`
- Create: `src/features/codex-config/ui/collections/project-trust-editor.tsx`
- Create: `src/features/codex-config/ui/expert-mode-editor.tsx`
- Create: `src/features/codex-config/hooks/use-config-editor.ts`

### 测试文件

- Create: `src/app/page.test.tsx`
- Create: `src/features/codex-config/metadata/registry.test.ts`
- Create: `src/features/codex-config/io/document-service.test.ts`
- Create: `src/features/codex-config/effective/resolve-effective-config.test.ts`
- Create: `src/app/api/config/route.test.ts`
- Create: `src/features/codex-config/ui/config-editor-app.test.tsx`
- Create: `src/features/codex-config/ui/collections/project-trust-editor.test.tsx`

### 文档

- Modify: `README.md`（若不存在则创建）

---

### Task 1: 搭建 Next.js 应用骨架与测试基座

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next-env.d.ts`
- Create: `next.config.ts`
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Create: `src/test/setup.ts`
- Test: `src/app/page.test.tsx`

- [ ] **Step 1: 写入项目清单与应用/工具链配置**

```json
{
  "name": "tomlviewer",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run"
  }
}
```

- [ ] **Step 2: 安装运行时和测试依赖**

Run: `npm install next react react-dom react-hook-form @hookform/resolvers zod @iarna/toml clsx`

Run: `npm install -D typescript @types/node @types/react @types/react-dom eslint eslint-config-next vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`

Expected: 安装完成并生成 `package-lock.json`

- [ ] **Step 3: 先写应用壳的失败测试**

```tsx
import { render, screen } from "@testing-library/react";
import Page from "./page";

it("renders the Codex config editor heading", () => {
  render(<Page />);
  expect(screen.getByRole("heading", { name: /codex config editor/i })).toBeInTheDocument();
});
```

- [ ] **Step 4: 运行测试，确认当前失败**

Run: `npm run test -- src/app/page.test.tsx`

Expected: FAIL，因为 `src/app/page.tsx` 还没有渲染对应标题，或测试环境尚未补齐

- [ ] **Step 5: 实现最小可用页面壳与测试初始化**

```tsx
export default function Page() {
  return (
    <main>
      <h1>Codex Config Editor</h1>
      <p>Windows local editor for Codex config.toml</p>
    </main>
  );
}
```

- [ ] **Step 6: 重新跑烟雾测试和 lint**

Run: `npm run test -- src/app/page.test.tsx`

Expected: PASS

Run: `npm run lint`

Expected: PASS

- [ ] **Step 7: 提交**

```bash
git add package.json package-lock.json tsconfig.json next-env.d.ts next.config.ts eslint.config.mjs vitest.config.ts src/app src/test
git commit -m "chore: scaffold next app and test harness"
```

### Task 2: 定义 Codex 配置字段元数据注册表

**Files:**
- Create: `src/features/codex-config/types.ts`
- Create: `src/features/codex-config/metadata/sections.ts`
- Create: `src/features/codex-config/metadata/defaults.ts`
- Create: `src/features/codex-config/metadata/registry.ts`
- Test: `src/features/codex-config/metadata/registry.test.ts`

- [ ] **Step 1: 先写字段元数据的失败测试**

```ts
import { fieldRegistry } from "./registry";

it("defines the model field with Chinese description and global scope guidance", () => {
  const field = fieldRegistry.find((item) => item.keyPath === "model");
  expect(field?.label).toBe("主模型");
  expect(field?.recommendedScope).toBe("global");
  expect(field?.allowedValues).toContain("gpt-5.4");
});
```

- [ ] **Step 2: 运行元数据测试，确认失败**

Run: `npm run test -- src/features/codex-config/metadata/registry.test.ts`

Expected: FAIL，因为注册表尚不存在

- [ ] **Step 3: 实现核心元数据类型与注册表**

```ts
export type ConfigScope = "global" | "project" | "either";

export interface ConfigFieldDefinition {
  keyPath: string;
  label: string;
  description: string;
  recommendedScope: ConfigScope;
  kind: "string" | "number" | "boolean" | "enum" | "array" | "object";
  allowedValues?: string[];
  risk?: "normal" | "warning" | "danger";
}
```

至少先补齐这些字段的定义：
- `model`
- `model_reasoning_effort`
- `service_tier`
- `approval_policy`
- `sandbox_mode`
- `web_search`
- `windows.sandbox`

- [ ] **Step 4: 增加分组定义与默认行为说明文案**

```ts
export const sectionOrder = [
  "核心模型",
  "推理与输出",
  "安全与沙箱",
  "搜索与体验",
  "历史与通知",
  "Profiles",
  "Model Providers",
  "Projects 信任",
  "专家模式",
] as const;
```

- [ ] **Step 5: 跑元数据测试**

Run: `npm run test -- src/features/codex-config/metadata/registry.test.ts`

Expected: PASS

- [ ] **Step 6: 提交**

```bash
git add src/features/codex-config/types.ts src/features/codex-config/metadata src/features/codex-config/metadata/registry.test.ts
git commit -m "feat: add codex config metadata registry"
```

### Task 3: 实现 Windows 路径、备份与 TOML 文档服务

**Files:**
- Create: `src/features/codex-config/io/paths.ts`
- Create: `src/features/codex-config/io/backup.ts`
- Create: `src/features/codex-config/io/toml-document.ts`
- Create: `src/features/codex-config/io/merge-known-fields.ts`
- Create: `src/features/codex-config/io/document-service.ts`
- Test: `src/features/codex-config/io/document-service.test.ts`

- [ ] **Step 1: 先写文档服务失败测试**

```ts
it("loads the current user's global config path on Windows", async () => {
  const path = resolveGlobalConfigPath("C:/Users/lucius");
  expect(path).toBe("C:/Users/lucius/.codex/config.toml");
});

it("preserves unknown keys when saving edited known fields", async () => {
  const original = 'model = "gpt-5.4"\nunknown_key = "keep-me"\n';
  const updated = saveKnownFields(original, { model: "gpt-5.4-mini" });
  expect(updated).toContain('unknown_key = "keep-me"');
});
```

- [ ] **Step 2: 运行文档服务测试，确认失败**

Run: `npm run test -- src/features/codex-config/io/document-service.test.ts`

Expected: FAIL，因为路径解析和合并保存服务还不存在

- [ ] **Step 3: 实现 Windows 路径解析与备份命名**

```ts
export function resolveGlobalConfigPath(userHome: string) {
  return `${userHome.replace(/\\/g, "/")}/.codex/config.toml`;
}

export function resolveProjectConfigPath(projectRoot: string) {
  return `${projectRoot.replace(/\\/g, "/")}/.codex/config.toml`;
}
```

- [ ] **Step 4: 实现解析、合并与保存辅助函数**

使用 `@iarna/toml` 解析/序列化对象，并把已编辑的已知字段合并回原始文档对象，确保未知字段仍然存在。

```ts
const parsed = TOML.parse(source);
const merged = mergeKnownFields(parsed, editedKnownFields);
return TOML.stringify(merged);
```

- [ ] **Step 5: 实现先备份后写回流程**

```ts
if (existsSync(targetPath)) {
  copyFileSync(targetPath, `${targetPath}.bak.${timestamp}`);
}
writeFileSync(targetPath, nextToml, "utf8");
```

- [ ] **Step 6: 跑文档服务测试**

Run: `npm run test -- src/features/codex-config/io/document-service.test.ts`

Expected: PASS

- [ ] **Step 7: 提交**

```bash
git add src/features/codex-config/io src/features/codex-config/io/document-service.test.ts
git commit -m "feat: add config document service"
```

### Task 4: 增加字段校验与最终生效值解析

**Files:**
- Create: `src/features/codex-config/validation/schema.ts`
- Create: `src/features/codex-config/effective/resolve-effective-config.ts`
- Test: `src/features/codex-config/effective/resolve-effective-config.test.ts`

- [ ] **Step 1: 先写校验与来源解析的失败测试**

```ts
it("rejects invalid sandbox_mode values", () => {
  expect(() => validateKnownFields({ sandbox_mode: "unsafe-mode" })).toThrow(/sandbox_mode/i);
});

it("reports project values as overriding global values", () => {
  const resolved = resolveEffectiveConfig(
    { model: "gpt-5.4" },
    { model: "gpt-5.4-mini" }
  );
  expect(resolved.model.source).toBe("project");
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `npm run test -- src/features/codex-config/effective/resolve-effective-config.test.ts`

Expected: FAIL，因为校验器和解析器尚不存在

- [ ] **Step 3: 用 Zod 实现已知字段校验**

```ts
const knownFieldSchema = z.object({
  model: z.string().optional(),
  sandbox_mode: z.enum(["read-only", "workspace-write", "danger-full-access"]).optional(),
  approval_policy: z.union([
    z.enum(["untrusted", "on-request", "never"]),
    z.record(z.unknown()),
  ]).optional(),
});
```

- [ ] **Step 4: 实现最终生效值解析器**

```ts
return {
  model: project.model
    ? { value: project.model, source: "project" }
    : global.model
      ? { value: global.model, source: "global" }
      : { value: "gpt-5.4", source: "default" },
};
```

- [ ] **Step 5: 重新运行校验与解析测试**

Run: `npm run test -- src/features/codex-config/effective/resolve-effective-config.test.ts`

Expected: PASS

- [ ] **Step 6: 提交**

```bash
git add src/features/codex-config/validation src/features/codex-config/effective
git commit -m "feat: add config validation and effective value resolver"
```

### Task 5: 实现本地配置 API

**Files:**
- Create: `src/features/codex-config/api/contracts.ts`
- Create: `src/app/api/config/route.ts`
- Test: `src/app/api/config/route.test.ts`

- [ ] **Step 1: 先写 route handler 失败测试**

```ts
it("returns the requested global config payload", async () => {
  const response = await GET(new Request("http://localhost/api/config?scope=global"));
  expect(response.status).toBe(200);
});
```

- [ ] **Step 2: 运行 route 测试，确认失败**

Run: `npm run test -- src/app/api/config/route.test.ts`

Expected: FAIL，因为路由处理器尚不存在

- [ ] **Step 3: 实现 GET 加载接口**

需要支持：
- `scope=global`
- `scope=project&projectPath=<path>`

返回内容至少包含：
- 原始 TOML
- 已解析的已知字段
- 最终生效值
- 可用的备份信息

- [ ] **Step 4: 实现 POST 保存接口**

POST body 至少包含：

```ts
{
  scope: "global" | "project";
  projectPath?: string;
  knownFields: Record<string, unknown>;
  rawToml?: string;
  mode: "visual" | "expert";
}
```

- [ ] **Step 5: 跑 route 测试**

Run: `npm run test -- src/app/api/config/route.test.ts`

Expected: PASS

- [ ] **Step 6: 提交**

```bash
git add src/features/codex-config/api src/app/api/config src/app/api/config/route.test.ts
git commit -m "feat: add local config api routes"
```

### Task 6: 搭建“说明优先”的应用主壳

**Files:**
- Create: `src/features/codex-config/ui/config-editor-app.tsx`
- Create: `src/features/codex-config/ui/mode-switcher.tsx`
- Create: `src/features/codex-config/ui/section-sidebar.tsx`
- Create: `src/features/codex-config/ui/right-panel.tsx`
- Create: `src/features/codex-config/ui/field-card.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`
- Test: `src/features/codex-config/ui/config-editor-app.test.tsx`

- [ ] **Step 1: 先写 UI 主壳失败测试**

```tsx
it("shows global/project mode tabs and sidebar sections", async () => {
  render(<ConfigEditorApp initialScope="global" />);
  expect(screen.getByRole("tab", { name: "全局配置" })).toBeInTheDocument();
  expect(screen.getByText("核心模型")).toBeInTheDocument();
});
```

- [ ] **Step 2: 运行主壳测试，确认失败**

Run: `npm run test -- src/features/codex-config/ui/config-editor-app.test.tsx`

Expected: FAIL，因为应用壳尚不存在

- [ ] **Step 3: 实现三栏式主布局**

中间栏必须优先展示：
- 字段卡片
- 简短中文解释
- 可展开详情

右侧栏必须展示：
- 当前层级
- 覆盖关系提示
- 风险摘要
- 脏状态 / 保存状态

- [ ] **Step 4: 将应用壳接入 `src/app/page.tsx`**

```tsx
import { ConfigEditorApp } from "@/features/codex-config/ui/config-editor-app";

export default function Page() {
  return <ConfigEditorApp initialScope="global" />;
}
```

- [ ] **Step 5: 重新跑主壳测试与 lint**

Run: `npm run test -- src/features/codex-config/ui/config-editor-app.test.tsx`

Expected: PASS

Run: `npm run lint`

Expected: PASS

- [ ] **Step 6: 提交**

```bash
git add src/app/page.tsx src/app/globals.css src/features/codex-config/ui
git commit -m "feat: build explanation first editor shell"
```

### Task 7: 增加常用字段的可视化编辑与保存流程

**Files:**
- Create: `src/features/codex-config/hooks/use-config-editor.ts`
- Create: `src/features/codex-config/ui/section-editor.tsx`
- Create: `src/features/codex-config/ui/controls/text-control.tsx`
- Create: `src/features/codex-config/ui/controls/select-control.tsx`
- Create: `src/features/codex-config/ui/controls/boolean-control.tsx`
- Modify: `src/features/codex-config/ui/config-editor-app.tsx`
- Test: `src/features/codex-config/ui/config-editor-app.test.tsx`

- [ ] **Step 1: 先写交互失败测试**

```tsx
it("marks the form dirty and saves an edited model value", async () => {
  render(<ConfigEditorApp initialScope="global" />);
  await user.selectOptions(screen.getByLabelText(/主模型/i), "gpt-5.4");
  expect(screen.getByText(/未保存更改/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: 运行交互测试，确认失败**

Run: `npm run test -- src/features/codex-config/ui/config-editor-app.test.tsx`

Expected: FAIL，因为表单控件与保存状态尚未打通

- [ ] **Step 3: 实现元数据驱动的字段渲染**

使用 `react-hook-form`，按字段类型拆出控制器：
- text
- select
- boolean
- 必要时的 array chip list

每个字段卡片必须显示：
- 中文名
- 原始键名
- 简短说明
- 当前值 / 默认值状态
- 展开详情按钮

- [ ] **Step 4: 实现加载、脏状态与保存请求**

hook 至少要负责：
- 加载当前配置
- 跟踪脏状态
- POST 到 `/api/config`
- 展示备份路径与最近保存时间

- [ ] **Step 5: 跑交互测试**

Run: `npm run test -- src/features/codex-config/ui/config-editor-app.test.tsx`

Expected: PASS

- [ ] **Step 6: 提交**

```bash
git add src/features/codex-config/hooks src/features/codex-config/ui
git commit -m "feat: add metadata driven field editing"
```

### Task 8: 实现集合编辑器、专家模式与 V1 运行文档

**Files:**
- Create: `src/features/codex-config/ui/collections/profile-editor.tsx`
- Create: `src/features/codex-config/ui/collections/model-provider-editor.tsx`
- Create: `src/features/codex-config/ui/collections/project-trust-editor.tsx`
- Create: `src/features/codex-config/ui/expert-mode-editor.tsx`
- Modify: `src/features/codex-config/ui/config-editor-app.tsx`
- Test: `src/features/codex-config/ui/collections/project-trust-editor.test.tsx`
- Modify: `README.md`

- [ ] **Step 1: 先写集合编辑器失败测试**

```tsx
it("lets the user add a trusted project mapping", async () => {
  render(<ProjectTrustEditor value={{}} onChange={vi.fn()} />);
  await user.type(screen.getByLabelText(/项目路径/i), "E:/LuciusProject/TomlViewer");
  await user.click(screen.getByRole("button", { name: /添加/i }));
  expect(screen.getByText(/trusted/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: 运行集合编辑器测试，确认失败**

Run: `npm run test -- src/features/codex-config/ui/collections/project-trust-editor.test.tsx`

Expected: FAIL，因为集合编辑器尚不存在

- [ ] **Step 3: 实现 V1 范围内的集合编辑器**

要求支持：
- `profiles`：列表、新增、删除、编辑受支持字段
- `model_providers`：列表、新增、删除、编辑受支持 provider 字段
- `projects`：仅在全局配置中编辑 trust mapping

- [ ] **Step 4: 实现默认折叠的专家模式**

需要展示：
- 原始 TOML 文本区
- 风险警告条
- 解析 / 保存错误

默认不能展开。

- [ ] **Step 5: 补充 README 运行说明**

文档至少写明：
- `npm install`
- `npm run dev`
- Windows 下全局 / 项目配置的默认路径

- [ ] **Step 6: 跑完整验证**

Run: `npm run test`

Expected: PASS

Run: `npm run build`

Expected: PASS

Run: `npm run lint`

Expected: PASS

- [ ] **Step 7: 提交**

```bash
git add src/features/codex-config/ui src/features/codex-config/ui/collections src/features/codex-config/ui/expert-mode-editor.tsx README.md
git commit -m "feat: add collection editors and expert mode"
```
