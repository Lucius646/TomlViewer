import { useState } from "react";

interface ModelProviderValue {
  name?: string;
  base_url?: string;
  wire_api?: string;
  env_key?: string;
}

interface ModelProviderEditorProps {
  value: Record<string, ModelProviderValue>;
  onChange: (value: Record<string, ModelProviderValue>) => void;
}

export function ModelProviderEditor({ value, onChange }: ModelProviderEditorProps) {
  const [providerId, setProviderId] = useState("");

  return (
    <section className="collection-editor">
      <div className="collection-editor__toolbar">
        <label className="field-control">
          <span className="field-control__label">Provider ID</span>
          <input
            aria-label="Provider ID"
            className="field-control__input"
            value={providerId}
            onChange={(event) => setProviderId(event.target.value)}
          />
        </label>
        <button
          type="button"
          className="collection-editor__action"
          onClick={() => {
            if (!providerId.trim()) {
              return;
            }

            onChange({
              ...value,
              [providerId.trim()]: value[providerId.trim()] ?? {},
            });
            setProviderId("");
          }}
        >
          添加 Provider
        </button>
      </div>

      <div className="collection-editor__list">
        {Object.entries(value).map(([id, provider]) => (
          <article key={id} className="collection-editor__card collection-editor__card--stacked">
            <div className="collection-editor__card-header">
              <h3>{id}</h3>
              <button
                type="button"
                className="collection-editor__remove"
                onClick={() => {
                  const nextValue = { ...value };
                  delete nextValue[id];
                  onChange(nextValue);
                }}
              >
                删除
              </button>
            </div>
            <label className="field-control">
              <span className="field-control__label">Base URL</span>
              <input
                aria-label={`${id}-base-url`}
                className="field-control__input"
                value={provider.base_url ?? ""}
                onChange={(event) =>
                  onChange({
                    ...value,
                    [id]: {
                      ...provider,
                      base_url: event.target.value || undefined,
                    },
                  })
                }
              />
            </label>
            <label className="field-control">
              <span className="field-control__label">Wire API</span>
              <input
                aria-label={`${id}-wire-api`}
                className="field-control__input"
                value={provider.wire_api ?? ""}
                onChange={(event) =>
                  onChange({
                    ...value,
                    [id]: {
                      ...provider,
                      wire_api: event.target.value || undefined,
                    },
                  })
                }
              />
            </label>
          </article>
        ))}
      </div>
    </section>
  );
}