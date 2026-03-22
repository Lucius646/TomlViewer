import { z } from "zod";

const granularApprovalSchema = z
  .object({
    sandbox_approval: z.boolean().optional(),
    rules: z.boolean().optional(),
    mcp_elicitations: z.boolean().optional(),
  })
  .refine(
    (value) => Object.values(value).some((entry) => entry !== undefined),
    "approval_policy.granular must declare at least one rule",
  );

const approvalPolicySchema = z.union([
  z.enum(["untrusted", "on-request", "never"]),
  z.object({
    granular: granularApprovalSchema,
  }),
]);

const projectTrustMappingSchema = z.record(
  z.string(),
  z.object({
    trust_level: z.enum(["trusted", "untrusted"]),
  }),
);

const profilePresetSchema = z.object({
  model: z.string().optional(),
  model_provider: z.string().optional(),
  approval_policy: approvalPolicySchema.optional(),
  sandbox_mode: z.enum(["read-only", "workspace-write", "danger-full-access"]).optional(),
  service_tier: z.enum(["fast", "flex"]).optional(),
});

const modelProviderSchema = z.object({
  name: z.string().optional(),
  base_url: z.string().optional(),
  wire_api: z.string().optional(),
  env_key: z.string().optional(),
});

export const knownFieldSchema = z.object({
  model: z.string().optional(),
  service_tier: z.enum(["fast", "flex"]).optional(),
  model_reasoning_effort: z.enum(["minimal", "low", "medium", "high", "xhigh"]).optional(),
  approval_policy: approvalPolicySchema.optional(),
  sandbox_mode: z.enum(["read-only", "workspace-write", "danger-full-access"]).optional(),
  "windows.sandbox": z.enum(["unelevated", "elevated"]).optional(),
  web_search: z.enum(["disabled", "cached", "live"]).optional(),
  project_doc_max_bytes: z.number().int().positive().optional(),
  project_doc_fallback_filenames: z.array(z.string()).optional(),
  "history.persistence": z.enum(["save-all", "none"]).optional(),
  "history.max_bytes": z.number().int().positive().optional(),
  profiles: z.record(z.string(), profilePresetSchema).optional(),
  profile: z.string().optional(),
  model_providers: z.record(z.string(), modelProviderSchema).optional(),
  model_provider: z.string().optional(),
  oss_provider: z.string().optional(),
  projects: projectTrustMappingSchema.optional(),
  developer_instructions: z.string().optional(),
  compact_prompt: z.string().optional(),
});

export type KnownFieldValues = z.infer<typeof knownFieldSchema>;

export function validateKnownFields(input: Record<string, unknown>) {
  return knownFieldSchema.parse(input);
}