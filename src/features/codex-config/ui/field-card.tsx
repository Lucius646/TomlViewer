"use client";

import { useState, type ReactNode } from "react";

import clsx from "clsx";

import type { EffectiveConfigEntry } from "../effective/resolve-effective-config";
import type { ConfigFieldDefinition } from "../types";

interface FieldCardProps {
  field: ConfigFieldDefinition;
  effectiveEntry?: EffectiveConfigEntry;
  currentValue?: unknown;
  children?: ReactNode;
}

function formatValue(value: unknown) {
  if (value === undefined) {
    return "未设置";
  }

  if (Array.isArray(value)) {
    return value.length === 0 ? "空列表" : value.join(", ");
  }

  if (typeof value === "object" && value !== null) {
    return "结构化对象";
  }

  return String(value);
}

function formatScope(scope: ConfigFieldDefinition["recommendedScope"]) {
  if (scope === "either") {
    return "全局或项目";
  }

  return scope === "global" ? "更适合全局配置" : "更适合项目配置";
}

function formatSource(source: EffectiveConfigEntry["source"] | undefined) {
  switch (source) {
    case "project":
      return "项目配置覆盖";
    case "global":
      return "来自全局配置";
    case "default":
      return "使用默认值";
    default:
      return "当前未生效";
  }
}

export function FieldCard({ field, effectiveEntry, currentValue, children }: FieldCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className={clsx("field-card", field.risk && `field-card--${field.risk}`)}>
      <div className="field-card__header">
        <div>
          <p className="field-card__eyebrow">{field.keyPath}</p>
          <h3>{field.label}</h3>
        </div>
        <button
          type="button"
          className="field-card__toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? "收起说明" : "查看详情"}
        </button>
      </div>

      <p className="field-card__description">{field.description}</p>

      <div className="field-card__control">{children}</div>

      <dl className="field-card__facts">
        <div>
          <dt>推荐层级</dt>
          <dd>{formatScope(field.recommendedScope)}</dd>
        </div>
        <div>
          <dt>当前状态</dt>
          <dd>{formatValue(currentValue ?? effectiveEntry?.value ?? field.defaultValue)}</dd>
        </div>
        <div>
          <dt>生效来源</dt>
          <dd>{formatSource(effectiveEntry?.source)}</dd>
        </div>
      </dl>

      {expanded ? (
        <div className="field-card__details">
          <p>
            <strong>默认行为：</strong>
            {field.defaultBehavior}
          </p>
          {field.allowedValues?.length ? (
            <p>
              <strong>可选值：</strong>
              {field.allowedValues.join(" / ")}
            </p>
          ) : null}
          {field.structuredValue ? (
            <p>
              <strong>结构说明：</strong>
              {field.structuredValue.description}
            </p>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}