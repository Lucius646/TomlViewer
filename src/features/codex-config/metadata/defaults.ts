export const defaultFieldValues = {
  model: "gpt-5.4",
  model_reasoning_effort: "medium",
  service_tier: "flex",
  approval_policy: "on-request",
  sandbox_mode: "read-only",
  web_search: "cached",
  "windows.sandbox": "unelevated",
  project_doc_max_bytes: 4096,
  project_doc_fallback_filenames: ["AGENTS.md", "README.md"],
} as const;