"use client";

import clsx from "clsx";

import type { ConfigApiScope } from "../api/contracts";

interface ModeSwitcherProps {
  scope: ConfigApiScope;
  onChange: (scope: ConfigApiScope) => void;
}

const scopeOptions: Array<{ value: ConfigApiScope; label: string; hint: string }> = [
  {
    value: "global",
    label: "全局配置",
    hint: "编辑用户级 ~/.codex/config.toml",
  },
  {
    value: "project",
    label: "项目配置",
    hint: "编辑项目内 .codex/config.toml",
  },
];

export function ModeSwitcher({ scope, onChange }: ModeSwitcherProps) {
  return (
    <div className="mode-switcher" role="tablist" aria-label="配置层级">
      {scopeOptions.map((option) => {
        const selected = option.value === scope;
        const labelId = `scope-tab-label-${option.value}`;
        const hintId = `scope-tab-hint-${option.value}`;

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-labelledby={labelId}
            aria-describedby={hintId}
            className={clsx("mode-switcher__tab", selected && "mode-switcher__tab--active")}
            onClick={() => onChange(option.value)}
          >
            <span id={labelId} className="mode-switcher__label">{option.label}</span>
            <span id={hintId} className="mode-switcher__hint">{option.hint}</span>
          </button>
        );
      })}
    </div>
  );
}