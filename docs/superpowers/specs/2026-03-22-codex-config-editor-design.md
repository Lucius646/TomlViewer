# Codex Config Editor Design

## Goal

Build a Windows-only local web app for editing Codex `config.toml` with a visual UI, field-by-field explanations in Chinese, direct read/write support for real config files, and an optional expert-mode raw TOML fallback.

The product should let a user who does not understand TOML safely edit:

- User/global config: `C:\Users\<user>\.codex\config.toml`
- Project/local config: `<project>\.codex\config.toml`

## Product Intent

This is not just a generic TOML viewer. It is a Codex configuration editor with product knowledge about:

- Config layer precedence
- Which settings are safer or riskier
- Which settings are better suited for global vs project scope
- Which structures are simple fields versus named collections
- The difference between project-local config files and `[projects."<path>"]` trust mappings in the global config

The UI must assume the user does not know TOML.

## Scope

### In Scope For V1

- Windows only
- Local web app with direct file read/write
- Global config editor
- Project config editor
- Metadata-driven field descriptions in Chinese
- Visual forms for common and advanced fields
- Dedicated UI for selected named collections:
  - `profiles`
  - `model_providers`
  - `projects` trust mappings
- Hidden expert-mode raw TOML editor for fallback
- Preserve unknown keys and unsupported structures during save
- Automatic backup before write
- Effective-value/source display for global vs project editing

### Out of Scope For V1

- macOS/Linux support
- Desktop shell packaging
- Full visual management for every complex section
- Full visual editors for:
  - `apps`
  - `otel`
  - `skills.config`
  - all `agents.*` substructures
  - all `mcp_servers` variants
- Sync across multiple machines
- Remote file editing

For unsupported complex sections, V1 should preserve them and expose them through expert mode rather than dropping them.

## User Context

The primary user is a Codex CLI user on Windows who wants to change configuration safely without editing TOML manually. The user may understand the meaning of settings only if the UI explains them in plain Chinese.

## Core UX Principles

1. Explanation before syntax
2. Safety before speed
3. Real config file editing, not import/export only
4. Layer awareness: global vs project must always be obvious
5. Unknown-field preservation: unsupported config must survive round trips

## Information Architecture

The application uses an explanation-first layout.

### Top-Level Modes

- `全局配置`
- `项目配置`

### Main Layout

- Left sidebar: section navigation
- Center panel: form-driven editor with concise field descriptions
- Right panel: current scope, precedence notes, risk warnings, save state, backup info

### Sidebar Sections

- 核心模型
- 推理与输出
- 安全与沙箱
- 搜索与体验
- 历史与通知
- Profiles
- Model Providers
- Projects 信任
- 专家模式

## Field Explanation Model

Each visual field is backed by metadata and must display:

- Chinese label
- Raw TOML key
- One-line purpose description
- Current value
- Default behavior when unset
- Recommended scope: global or project
- Risk level when relevant
- Allowed values for enum-like settings
- Expandable details section with longer explanation and example

### Default Display Pattern

By default, only concise text is shown. The user can expand a field to see:

- Detailed explanation
- Default behavior
- Example TOML
- Related settings
- Scope guidance
- Safety notes

This keeps the UI beginner-friendly without hiding important meaning.

## Config Sections and V1 Editing Strategy

### 1. Common Scalar / Small Table Settings

These should be fully visualized in V1 through forms:

- `model`
- `model_provider`
- `review_model`
- `personality`
- `service_tier`
- `model_reasoning_effort`
- `plan_mode_reasoning_effort`
- `model_reasoning_summary`
- `model_verbosity`
- `approval_policy`
- `allow_login_shell`
- `sandbox_mode`
- `web_search`
- `file_opener`
- `hide_agent_reasoning`
- `show_raw_agent_reasoning`
- `disable_paste_burst`
- `check_for_update_on_startup`
- `project_doc_max_bytes`
- `project_doc_fallback_filenames`
- `windows.sandbox`
- `history.persistence`
- `history.max_bytes`
- `tui.notifications`
- `tui.notification_method`
- `tui.animations`
- `tui.show_tooltips`
- `analytics.enabled`
- `feedback.enabled`
- `sandbox_workspace_write.*`
- `shell_environment_policy.*`

### 2. Named Collection Editors

These require list/detail interfaces instead of plain forms:

#### `profiles`

- list all profile names
- create, rename, delete profile
- edit supported profile fields via same metadata system

#### `model_providers`

- list provider entries
- create, edit, delete provider
- support provider basics in V1:
  - `name`
  - `base_url`
  - `wire_api`
  - `env_key`
  - `env_key_instructions`
  - `query_params`
  - `http_headers`
  - `env_http_headers`

#### `projects`

Treat this as a global-config trust mapping manager, not a local project config editor.

- list trusted/untrusted project paths
- add/edit/remove trust mapping
- clearly explain that this is stored in global config
- clearly explain that this is different from `<project>\.codex\config.toml`

### 3. Expert-Mode Fallback

Expert mode is collapsed by default.

It provides:

- raw TOML editor
- unsupported/unknown key visibility
- warning that it is for advanced users
- save path still goes through backup + validation + preserve-unknown logic

## Global vs Project Editing Behavior

### Global Mode

- reads `C:\Users\<user>\.codex\config.toml`
- allows editing global keys and `projects` trust mappings

### Project Mode

- user selects or enters a project path
- app resolves `<project>\.codex\config.toml`
- if file does not exist, app offers to create it
- app explains that project values override global values for that project
- app warns that project config may be ignored when the project is untrusted

### Precedence Messaging

The UI must explicitly teach:

- project config overrides global config
- `[projects."<path>"]` inside the global config is only trust metadata
- project-local `.codex\config.toml` is a different file

## Data Model

The implementation should separate four concerns.

### 1. Field Metadata Registry

Stores per-field definitions:

- key path
- label
- description
- type
- default behavior text
- enum values
- recommended scope
- risk flags
- whether supported in visual mode

### 2. Config Document Service

Responsible for:

- reading files
- parsing TOML
- preserving unknown content
- serializing back to TOML
- creating backups
- writing files safely

### 3. Effective Config Resolver

Responsible for:

- showing where a current value comes from
- distinguishing explicit value vs unset/default
- showing override behavior in project mode

### 4. UI Layer

Responsible for:

- rendering forms from metadata
- showing explanations
- validation messages
- dirty state
- save interactions

## File Behavior

### Read Paths

- global config: `~/.codex/config.toml` on Windows via the current user profile
- local project config: `<selected-project>\.codex\config.toml`

### Save Behavior

Before every write:

1. validate input
2. create parent directory if needed
3. create timestamped backup of the target file if it exists
4. write updated TOML
5. surface backup location and modified timestamp in UI

### Preservation Rules

Saving must not drop:

- unknown top-level keys
- unsupported table structures
- unedited complex sections

If a section is unsupported visually, the app preserves it and routes edits through expert mode only.

## Validation Rules

### Hard Validation

Block save when:

- enum value is invalid
- numeric field is not a valid number
- boolean field is invalid
- required values for a created named entry are missing
- path input is empty where required

### Soft Validation

Warn but still allow save when:

- a field is edited in a less-recommended scope
- a risky value is selected, such as highly permissive sandboxing
- project config exists for a path that is not trusted

## Error Handling

The UI should provide explicit, user-readable errors for:

- config file missing
- config file unreadable
- TOML parse failure
- invalid field value
- backup failure
- write failure

When TOML cannot be parsed, the app should still show the file problem clearly and offer expert-mode recovery instead of silently overwriting the file.

## Testing Strategy

V1 should include automated coverage for:

- loading an existing global config
- loading a missing project config
- creating a new project `.codex\config.toml`
- editing a supported scalar field
- editing a supported nested field
- editing `projects` trust mappings
- preserving unknown keys after save
- rejecting invalid enum values
- backup creation before write
- showing correct effective source in project mode

## Design Decisions Locked In

- Windows only
- local web app
- explanation-first UI
- concise descriptions by default, expandable details on demand
- both global and project config supported
- expert mode available but hidden by default
- A-layout chosen: explanation-first, not TOML-preview-first

## Risks

- Codex config evolves over time, so metadata must be easy to update
- TOML round-trip preservation can be tricky if parser/writer choice is naive
- some advanced sections are too complex for V1 and must be preserved safely

## References

- OpenAI Codex Config Basics
- OpenAI Codex Config Reference
- OpenAI Codex Sample Configuration
- Local user config observed during design:
  - `C:\Users\lucius\.codex\config.toml`
- User-provided field notes:
  - `E:\LuciusProject\TomlViewer\部分toml属性.md`
