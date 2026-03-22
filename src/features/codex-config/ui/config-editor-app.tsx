"use client";

import { useState } from "react";

import type { ConfigApiScope } from "../api/contracts";
import { useConfigEditor } from "../hooks/use-config-editor";
import { fieldRegistry, sectionRegistry } from "../metadata/registry";
import { sectionOrder } from "../metadata/sections";
import type { ConfigSectionId } from "../types";
import { ModelProviderEditor } from "./collections/model-provider-editor";
import { ProfileEditor } from "./collections/profile-editor";
import { ProjectTrustEditor } from "./collections/project-trust-editor";
import { ExpertModeEditor } from "./expert-mode-editor";
import { ModeSwitcher } from "./mode-switcher";
import { RightPanel } from "./right-panel";
import { SectionEditor } from "./section-editor";
import { SectionSidebar } from "./section-sidebar";

interface ConfigEditorAppProps {
  initialScope: ConfigApiScope;
}

function getOrderedSections() {
  const order = new Map(sectionOrder.map((sectionId, index) => [sectionId, index]));

  return [...sectionRegistry].sort(
    (left, right) =>
      (order.get(left.id) ?? Number.MAX_SAFE_INTEGER) - (order.get(right.id) ?? Number.MAX_SAFE_INTEGER),
  );
}

const orderedSections = getOrderedSections();

export function ConfigEditorApp({ initialScope }: ConfigEditorAppProps) {
  const [scope, setScope] = useState<ConfigApiScope>(initialScope);
  const [projectPath, setProjectPath] = useState("");
  const [activeSectionId, setActiveSectionId] = useState<ConfigSectionId>(orderedSections[0]?.id ?? "core-model");
  const editor = useConfigEditor({ scope, projectPath: projectPath || undefined });

  const activeSection = orderedSections.find((section) => section.id === activeSectionId) ?? orderedSections[0];
  const visibleFields = fieldRegistry.filter((field) => field.sectionId === activeSection.id);

  let content = (
    <SectionEditor
      control={editor.control}
      currentValues={editor.currentValues}
      effectiveValues={editor.effectiveValues}
      fields={visibleFields}
      isLoading={editor.isLoading}
    />
  );
  let onSave = () => void editor.save();
  let saveDisabled = editor.isLoading || !editor.isDirty;

  if (activeSection.id === "profiles") {
    content = (
      <ProfileEditor
        value={(editor.currentValues.profiles as Record<string, { model?: string; model_provider?: string }>) ?? {}}
        onChange={(value) => editor.setKnownField("profiles", value)}
      />
    );
  } else if (activeSection.id === "model-providers") {
    content = (
      <ModelProviderEditor
        value={(editor.currentValues.model_providers as Record<string, { base_url?: string; wire_api?: string }>) ?? {}}
        onChange={(value) => editor.setKnownField("model_providers", value)}
      />
    );
  } else if (activeSection.id === "project-trust") {
    content = (
      <ProjectTrustEditor
        value={(editor.currentValues.projects as Record<string, { trust_level: "trusted" | "untrusted" }>) ?? {}}
        onChange={(value) => editor.setKnownField("projects", value)}
      />
    );
  } else if (activeSection.id === "expert-mode") {
    content = (
      <ExpertModeEditor
        error={editor.error}
        onChange={editor.setRawToml}
        onSave={() => void editor.saveExpert()}
        rawToml={editor.rawToml}
        saveDisabled={editor.isLoading || !editor.isExpertDirty}
      />
    );
    onSave = () => void editor.saveExpert();
    saveDisabled = editor.isLoading || !editor.isExpertDirty;
  }

  return (
    <main className="config-editor">
      <header className="config-editor__hero">
        <div>
          <p className="config-editor__eyebrow">Codex 配置控制台</p>
          <h1>Codex Config Editor</h1>
          <p className="config-editor__lead">
            面向 Windows 的本地可视化配置编辑器。先解释字段，再允许修改真实的
            <code> config.toml </code>
            文件。
          </p>
        </div>
        <div className="config-editor__hero-controls">
          <ModeSwitcher scope={scope} onChange={setScope} />
          {scope === "project" ? (
            <label className="field-control config-editor__project-path">
              <span className="field-control__label">项目路径</span>
              <input
                aria-label="项目路径"
                className="field-control__input"
                placeholder="E:/LuciusProject/TomlViewer"
                value={projectPath}
                onChange={(event) => setProjectPath(event.target.value)}
              />
            </label>
          ) : null}
        </div>
      </header>

      <section className="config-editor__layout">
        <SectionSidebar
          sections={orderedSections}
          fields={fieldRegistry}
          activeSectionId={activeSection.id}
          onSelect={setActiveSectionId}
        />

        <section className="config-editor__content" aria-label="字段说明区">
          <header className="config-editor__content-header">
            <div>
              <p className="config-editor__section-tag">{activeSection.label}</p>
              <h2>{activeSection.description}</h2>
            </div>
            <p className="config-editor__section-note">
              每张卡片都先展示“这是干什么的”和默认行为。详细说明折叠在详情里，避免首次使用时被 TOML 术语淹没。
            </p>
          </header>

          {editor.error && activeSection.id !== "expert-mode" ? <p className="config-editor__error">{editor.error}</p> : null}

          {content}
        </section>

        <RightPanel
          scope={scope}
          activeSection={activeSection}
          fields={visibleFields}
          effectiveValues={editor.effectiveValues}
          isDirty={activeSection.id === "expert-mode" ? editor.isExpertDirty : editor.isDirty}
          onSave={onSave}
          saveDisabled={saveDisabled}
          saveState={editor.saveState}
          targetPath={editor.targetPath}
        />
      </section>
    </main>
  );
}