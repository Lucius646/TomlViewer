import { useState } from "react";

interface ProjectTrustValue {
  trust_level: "trusted" | "untrusted";
}

interface ProjectTrustEditorProps {
  value: Record<string, ProjectTrustValue>;
  onChange: (value: Record<string, ProjectTrustValue>) => void;
}

export function ProjectTrustEditor({ value, onChange }: ProjectTrustEditorProps) {
  const [projectPath, setProjectPath] = useState("");
  const [trustLevel, setTrustLevel] = useState<ProjectTrustValue["trust_level"]>("trusted");

  return (
    <section className="collection-editor">
      <div className="collection-editor__toolbar">
        <label className="field-control">
          <span className="field-control__label">项目路径</span>
          <input
            aria-label="项目路径"
            className="field-control__input"
            value={projectPath}
            onChange={(event) => setProjectPath(event.target.value)}
          />
        </label>
        <label className="field-control">
          <span className="field-control__label">信任等级</span>
          <select
            aria-label="信任等级"
            className="field-control__input"
            value={trustLevel}
            onChange={(event) => setTrustLevel(event.target.value as ProjectTrustValue["trust_level"])}
          >
            <option value="trusted">trusted</option>
            <option value="untrusted">untrusted</option>
          </select>
        </label>
        <button
          type="button"
          className="collection-editor__action"
          onClick={() => {
            if (!projectPath.trim()) {
              return;
            }

            onChange({
              ...value,
              [projectPath.trim()]: { trust_level: trustLevel },
            });
            setProjectPath("");
            setTrustLevel("trusted");
          }}
        >
          添加项目
        </button>
      </div>

      <div className="collection-editor__list">
        {Object.entries(value).map(([path, config]) => (
          <article key={path} className="collection-editor__card">
            <div>
              <h3>{path}</h3>
              <p>{config.trust_level}</p>
            </div>
            <button
              type="button"
              className="collection-editor__remove"
              onClick={() => {
                const nextValue = { ...value };
                delete nextValue[path];
                onChange(nextValue);
              }}
            >
              删除
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}