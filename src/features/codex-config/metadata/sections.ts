import type { ConfigSectionDefinition, ConfigSectionId } from "../types";

export const sectionOrder: readonly ConfigSectionId[] = [
  "core-model",
  "reasoning-output",
  "security-sandbox",
  "search-experience",
  "history-notifications",
  "profiles",
  "model-providers",
  "project-trust",
  "expert-mode",
] as const;

export const sectionRegistry: readonly ConfigSectionDefinition[] = [
  {
    id: "core-model",
    label: "核心模型",
    description: "选择默认模型和与模型本身强相关的全局设置。",
  },
  {
    id: "reasoning-output",
    label: "推理与输出",
    description: "控制推理力度、输出风格和模型能力相关偏好。",
  },
  {
    id: "security-sandbox",
    label: "安全与沙箱",
    description: "配置审批策略、运行沙箱和 Windows 沙箱行为。",
  },
  {
    id: "search-experience",
    label: "搜索与体验",
    description: "管理 web 搜索和交互体验相关设置。",
  },
  {
    id: "history-notifications",
    label: "历史与通知",
    description: "管理历史保存和通知行为。",
  },
  {
    id: "profiles",
    label: "Profiles",
    description: "管理命名预设与常用配置组合。",
  },
  {
    id: "model-providers",
    label: "Model Providers",
    description: "配置模型提供商和相关映射。",
  },
  {
    id: "project-trust",
    label: "Projects 信任",
    description: "管理全局配置中的项目 trust_level 映射。",
  },
  {
    id: "expert-mode",
    label: "专家模式",
    description: "保留复杂或原始结构的兜底编辑入口。",
  },
] as const;