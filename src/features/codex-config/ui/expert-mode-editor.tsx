import { useState } from "react";

interface ExpertModeEditorProps {
  error?: string | null;
  onChange: (value: string) => void;
  onSave: () => void;
  rawToml: string;
  saveDisabled?: boolean;
}

export function ExpertModeEditor({ error, onChange, onSave, rawToml, saveDisabled = false }: ExpertModeEditorProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="expert-mode-editor">
      <button
        type="button"
        className="collection-editor__action"
        onClick={() => setExpanded((current) => !current)}
      >
        {expanded ? "收起专家模式" : "打开专家模式"}
      </button>

      {expanded ? (
        <div className="expert-mode-editor__panel">
          <p className="expert-mode-editor__warning">
            专家模式会直接写回原始 TOML。这里不会帮你屏蔽未知字段，也不会替你规避语法错误。
          </p>
          {error ? <p className="config-editor__error">{error}</p> : null}
          <label className="field-control">
            <span className="field-control__label">原始 TOML</span>
            <textarea
              aria-label="原始 TOML"
              className="field-control__input expert-mode-editor__textarea"
              value={rawToml}
              onChange={(event) => onChange(event.target.value)}
            />
          </label>
          <button type="button" className="right-panel__save" disabled={saveDisabled} onClick={onSave}>
            保存 TOML
          </button>
        </div>
      ) : null}
    </section>
  );
}