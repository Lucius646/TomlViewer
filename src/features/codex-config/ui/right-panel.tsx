import type { ConfigApiScope } from "../api/contracts";
import type { EffectiveConfigEntry } from "../effective/resolve-effective-config";
import type { ConfigFieldDefinition, ConfigSectionDefinition } from "../types";

interface RightPanelProps {
  scope: ConfigApiScope;
  activeSection: ConfigSectionDefinition;
  fields: readonly ConfigFieldDefinition[];
  effectiveValues: Record<string, EffectiveConfigEntry>;
  isDirty?: boolean;
  onSave?: () => void;
  saveDisabled?: boolean;
  saveState?: "idle" | "saving" | "saved" | "error";
  targetPath?: string;
}

function getSourceSummary(
  effectiveValues: Record<string, EffectiveConfigEntry>,
  fields: readonly ConfigFieldDefinition[],
) {
  const counts = { project: 0, global: 0, default: 0, unset: 0 };

  for (const field of fields) {
    const entry = effectiveValues[field.keyPath];

    if (!entry) {
      counts.unset += 1;
      continue;
    }

    counts[entry.source] += 1;
  }

  return counts;
}

function getRiskSummary(fields: readonly ConfigFieldDefinition[]) {
  const warningCount = fields.filter((field) => field.risk === "warning").length;
  const dangerCount = fields.filter((field) => field.risk === "danger").length;

  if (dangerCount > 0) {
    return `当前分组包含 ${dangerCount} 个高风险字段，保存前需要再次确认权限与安全边界。`;
  }

  if (warningCount > 0) {
    return `当前分组包含 ${warningCount} 个需谨慎修改的字段，适合先理解说明再操作。`;
  }

  return "当前分组以说明型字段为主，适合先浏览和建立配置心智模型。";
}

function getSaveLabel(saveState: RightPanelProps["saveState"], isDirty: boolean) {
  if (saveState === "saving") {
    return "正在保存";
  }

  if (saveState === "saved") {
    return "最近一次保存成功";
  }

  if (saveState === "error") {
    return "最近一次保存失败";
  }

  return isDirty ? "未保存更改" : "尚未修改";
}

export function RightPanel({
  scope,
  activeSection,
  fields,
  effectiveValues,
  isDirty = false,
  onSave,
  saveDisabled = false,
  saveState = "idle",
  targetPath,
}: RightPanelProps) {
  const sourceSummary = getSourceSummary(effectiveValues, fields);
  const riskSummary = getRiskSummary(fields);

  return (
    <aside className="right-panel" aria-label="当前配置概览">
      <section className="right-panel__section">
        <p className="right-panel__eyebrow">当前层级</p>
        <h2>{scope === "global" ? "全局配置" : "项目配置"}</h2>
        <p>{targetPath ?? (scope === "global" ? "用户级 ~/.codex/config.toml" : "项目内 .codex/config.toml")}</p>
      </section>

      <section className="right-panel__section">
        <p className="right-panel__eyebrow">覆盖关系</p>
        <h3>{activeSection.label}</h3>
        <ul className="right-panel__list">
          <li>项目值：{sourceSummary.project}</li>
          <li>全局值：{sourceSummary.global}</li>
          <li>默认值：{sourceSummary.default}</li>
          <li>未设置：{sourceSummary.unset}</li>
        </ul>
      </section>

      <section className="right-panel__section">
        <p className="right-panel__eyebrow">风险摘要</p>
        <p>{riskSummary}</p>
      </section>

      <section className="right-panel__section">
        <p className="right-panel__eyebrow">保存状态</p>
        <p>{getSaveLabel(saveState, isDirty)}</p>
        <button type="button" className="right-panel__save" disabled={saveDisabled} onClick={onSave}>
          保存更改
        </button>
      </section>
    </aside>
  );
}