import { z } from "zod";

const approvalPolicySchema = z.union([
  z.enum(["untrusted", "on-request", "never"]),
  z.object({
    granular: z
      .object({
        sandbox_approval: z.boolean().optional(),
        rules: z.boolean().optional(),
        mcp_elicitations: z.boolean().optional(),
      })
      .optional(),
  }),
]);

const projectTrustMappingSchema = z.record(
  z.string(),
  z.object({
    trust_level: z.enum(["trusted", "untrusted"]),
  }),
);

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
  profile: z.string().optional(),
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