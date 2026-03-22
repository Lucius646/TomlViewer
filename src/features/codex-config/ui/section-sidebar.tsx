"use client";

import clsx from "clsx";

import type { ConfigFieldDefinition, ConfigSectionDefinition, ConfigSectionId } from "../types";

interface SectionSidebarProps {
  sections: readonly ConfigSectionDefinition[];
  fields: readonly ConfigFieldDefinition[];
  activeSectionId: ConfigSectionId;
  onSelect: (sectionId: ConfigSectionId) => void;
}

export function SectionSidebar({
  sections,
  fields,
  activeSectionId,
  onSelect,
}: SectionSidebarProps) {
  return (
    <aside className="section-sidebar" aria-label="配置分组导航">
      <div className="section-sidebar__intro">
        <p className="section-sidebar__eyebrow">说明优先</p>
        <h2>配置导航</h2>
        <p>先理解字段含义，再进入高级编辑。每个分组都保留中文解释和默认行为。</p>
      </div>
      <nav className="section-sidebar__nav">
        {sections.map((section) => {
          const isActive = section.id === activeSectionId;
          const fieldCount = fields.filter((field) => field.sectionId === section.id).length;

          return (
            <button
              key={section.id}
              type="button"
              className={clsx("section-sidebar__item", isActive && "section-sidebar__item--active")}
              onClick={() => onSelect(section.id)}
            >
              <span className="section-sidebar__item-label">{section.label}</span>
              <span className="section-sidebar__item-meta">{fieldCount} 个字段</span>
              <span className="section-sidebar__item-description">{section.description}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}