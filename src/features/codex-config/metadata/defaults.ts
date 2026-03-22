export const defaultFieldValues = {
  model: "gpt-5.4",
  model_provider: "openai",
  model_reasoning_effort: "medium",
  service_tier: "flex",
  approval_policy: "on-request",
  sandbox_mode: "read-only",
  web_search: "cached",
  project_doc_max_bytes: 32768,
  project_doc_fallback_filenames: [] as const,
  "history.persistence": "save-all",
  "windows.sandbox": "unelevated",
} as const;
