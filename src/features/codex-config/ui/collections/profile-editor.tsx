import { useState } from "react";

interface ProfileValue {
  model?: string;
  model_provider?: string;
  approval_policy?: string;
  sandbox_mode?: string;
}

interface ProfileEditorProps {
  value: Record<string, ProfileValue>;
  onChange: (value: Record<string, ProfileValue>) => void;
}

export function ProfileEditor({ value, onChange }: ProfileEditorProps) {
  const [profileName, setProfileName] = useState("");

  return (
    <section className="collection-editor">
      <div className="collection-editor__toolbar">
        <label className="field-control">
          <span className="field-control__label">Profile 名称</span>
          <input
            aria-label="Profile 名称"
            className="field-control__input"
            value={profileName}
            onChange={(event) => setProfileName(event.target.value)}
          />
        </label>
        <button
          type="button"
          className="collection-editor__action"
          onClick={() => {
            if (!profileName.trim()) {
              return;
            }

            onChange({
              ...value,
              [profileName.trim()]: value[profileName.trim()] ?? {},
            });
            setProfileName("");
          }}
        >
          添加 Profile
        </button>
      </div>

      <div className="collection-editor__list">
        {Object.entries(value).map(([name, profile]) => (
          <article key={name} className="collection-editor__card collection-editor__card--stacked">
            <div className="collection-editor__card-header">
              <h3>{name}</h3>
              <button
                type="button"
                className="collection-editor__remove"
                onClick={() => {
                  const nextValue = { ...value };
                  delete nextValue[name];
                  onChange(nextValue);
                }}
              >
                删除
              </button>
            </div>
            <label className="field-control">
              <span className="field-control__label">模型</span>
              <input
                aria-label={`${name}-模型`}
                className="field-control__input"
                value={profile.model ?? ""}
                onChange={(event) =>
                  onChange({
                    ...value,
                    [name]: {
                      ...profile,
                      model: event.target.value || undefined,
                    },
                  })
                }
              />
            </label>
            <label className="field-control">
              <span className="field-control__label">模型提供商</span>
              <input
                aria-label={`${name}-模型提供商`}
                className="field-control__input"
                value={profile.model_provider ?? ""}
                onChange={(event) =>
                  onChange({
                    ...value,
                    [name]: {
                      ...profile,
                      model_provider: event.target.value || undefined,
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