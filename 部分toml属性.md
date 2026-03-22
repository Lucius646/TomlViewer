# Codex 配置示例 (config.toml)
#
# 本文件列出 Codex 从 config.toml 读取的主要键，并给出默认行为、推荐示例和简短说明。
# 按需调整即可。
#
# 注意
# - TOML 根级键必须出现在表结构之前。
# - 默认是“未设置”的可选键用注释展示，并给出说明。
# - MCP 服务器、profiles、model providers 都是示例，按需删改。

################################################################################
# 核心模型选择
################################################################################

# Codex 使用的主模型。多数用户推荐值为 "gpt-5.4"。
model = "gpt-5.4"

# 支持 personality 的模型可设置沟通风格。允许值为 none | friendly | pragmatic
# personality = "pragmatic"

# /review 专用模型。默认不设置时使用当前会话模型。
# review_model = "gpt-5.4"

# 选用的模型提供商 ID，对应 [model_providers]。默认是 "openai"。
model_provider = "openai"

# --oss 会话使用的默认 OSS provider。不设置时会提示选择。
# oss_provider = "ollama"

# 服务档位。只有在 [features] 中启用时 fast 才生效。
# service_tier = "flex"  # fast | flex

# 可选的模型元数据覆盖。不设置时使用模型或预置默认值。
# model_context_window = 128000       # tokens；默认按模型自动
# model_auto_compact_token_limit = 64000  # tokens；不设置时用模型默认值
# tool_output_token_limit = 12000     # 每次工具输出存入上下文的 token 预算
# model_catalog_json = "/absolute/path/to/models.json" # 启动时加载的模型清单覆盖
# background_terminal_max_timeout = 300000 # ms；write_stdin 空轮询最大等待时长
# log_dir = "/absolute/path/to/codex-logs" # Codex 日志目录；默认 "$CODEX_HOME/log"
# sqlite_home = "/absolute/path/to/codex-state" # 可选 SQLite 状态目录

################################################################################
# 推理与输出详略 (支持 Responses API 的模型)
################################################################################

# 推理强度: minimal | low | medium | high | xhigh
# model_reasoning_effort = "medium"

# Plan mode 下的推理强度覆盖: none | minimal | low | medium | high | xhigh
# plan_mode_reasoning_effort = "high"

# 推理摘要级别: auto | concise | detailed | none
# model_reasoning_summary = "auto"

# GPT-5 系列输出详略: low | medium | high
# model_verbosity = "medium"

# 强制声明当前模型是否支持推理摘要。
# model_supports_reasoning_summaries = true

################################################################################
# 指令覆盖
################################################################################

# 额外用户指令，会在 AGENTS.md 之前注入。默认不设置。
# developer_instructions = ""

# 历史压缩提示词的内联覆盖。默认不设置。
# compact_prompt = ""

# commit 的共同作者尾注。设为 "" 可关闭。
# commit_attribution = "Jane Doe <jane@example.com>"

# 用文件覆盖默认基础指令。默认不设置。
# model_instructions_file = "/absolute/or/relative/path/to/instructions.txt"

# 从文件加载压缩提示词。默认不设置。
# experimental_compact_prompt_file = "/absolute/or/relative/path/to/compact_prompt.txt"

################################################################################
# 通知
################################################################################

# 外部通知程序 argv。默认不启用。
# notify = ["notify-send", "Codex"]

################################################################################
# 审批与沙箱
################################################################################

# 何时请求命令审批
# - untrusted: 仅已知安全的只读命令自动执行，其他提示
# - on-request: 由模型判断是否请求，默认值
# - never: 永不提示，风险更高
# - { reject = { ... } }: 自动拒绝指定类别的审批
approval_policy = "on-request"
# 细粒度自动拒绝示例
# approval_policy = { reject = { sandbox_approval = true, rules = false, mcp_elicitations = false } }

# 当 shell 工具请求 login = true 时，是否允许使用 login shell。
# 默认 true。设为 false 会强制非 login shell 并拒绝显式请求。
allow_login_shell = true

# 工具调用的文件系统与网络沙箱
# - read-only 默认
# - workspace-write
# - danger-full-access 无沙箱，风险极高
sandbox_mode = "read-only"

################################################################################
# 认证与登录
################################################################################

# CLI 登录凭据存储位置: file 默认 | keyring | auto
cli_auth_credentials_store = "file"

# ChatGPT 登录流程使用的基础地址，不是 OpenAI API。
chatgpt_base_url = "https://chatgpt.com/backend-api/"

# 将 ChatGPT 登录限制到指定 workspace id。默认不设置。
# forced_chatgpt_workspace_id = "00000000-0000-0000-0000-000000000000"

# 强制登录机制。默认不设置。
# 允许值 chatgpt | api
# forced_login_method = "chatgpt"

# MCP OAuth 凭据存储偏好: auto 默认 | file | keyring
mcp_oauth_credentials_store = "auto"
# MCP OAuth 回调固定端口。默认不设置。
# mcp_oauth_callback_port = 4321
# MCP OAuth 回调地址覆盖。默认不设置。
# 自定义回调路径可用，监听端口仍由 mcp_oauth_callback_port 控制。
# mcp_oauth_callback_url = "https://devbox.example.internal/callback"

################################################################################
# 项目文档控制
################################################################################

# 首轮指令中嵌入 AGENTS.md 的最大字节数。默认 32768
project_doc_max_bytes = 32768

# 某层目录缺少 AGENTS.md 时的候补文件名。默认空数组。
project_doc_fallback_filenames = []

# 搜索父目录时的项目根标记文件。默认 [".git"]
# project_root_markers = [".git"]

################################################################################
# 历史与文件打开器
################################################################################

# 点击引用时使用的 URI scheme: vscode 默认 | vscode-insiders | windsurf | cursor | none
file_opener = "vscode"

################################################################################
# UI 与杂项
################################################################################

# 隐藏内部推理事件。默认 false
hide_agent_reasoning = false

# 直接显示原始推理内容。默认 false
show_raw_agent_reasoning = false

# 关闭 TUI 粘贴爆发检测。默认 false
disable_paste_burst = false

# Windows 上确认过 WSL 初始化提示。默认 false
windows_wsl_setup_acknowledged = false

# 启动时检查更新。默认 true
check_for_update_on_startup = true

################################################################################
# Web 搜索
################################################################################

# Web 搜索模式: disabled | cached | live。默认 cached
# cached 使用索引缓存，live 拉取最新网页
# 在 --yolo 或全权限沙箱下，web_search 默认会是 live
web_search = "cached"

# 启用的 profile 名称。不设置时不应用 profile。
# profile = "default"

# 开启实验特性时是否压掉提示。默认不设置。
# suppress_unstable_features_warning = true

################################################################################
# Agents 多代理角色与限制
################################################################################

[agents]
# 最大并发 agent 线程数。默认 6
# max_threads = 6
# 最大嵌套深度。根会话从 0 开始。默认 1
# max_depth = 1
# spawn_agents_on_csv 的默认超时秒数。默认 1800
# job_max_runtime_seconds = 1800

# [agents.reviewer]
# description = "Find correctness, security, and test risks in code."
# config_file = "./agents/reviewer.toml"  # 相对路径基于当前 config.toml
# nickname_candidates = ["Athena", "Ada"]

################################################################################
# Skills 覆盖
################################################################################

# 禁用或启用某个技能
[[skills.config]]
# path = "/path/to/skill/SKILL.md"
# enabled = false

################################################################################
# 沙箱设置
################################################################################

# 仅当 sandbox_mode = "workspace-write" 时生效
[sandbox_workspace_write]
# 除了工作目录之外的额外可写根目录。默认空数组
writable_roots = []
# 允许沙箱内出站网络访问。默认 false
network_access = false
# 排除 $TMPDIR。默认 false
exclude_tmpdir_env_var = false
# 排除 /tmp。默认 false
exclude_slash_tmp = false

################################################################################
# 子进程环境变量策略
################################################################################

[shell_environment_policy]
# inherit: all 默认 | core | none
inherit = "all"
# 是否忽略默认敏感变量排除规则。默认 false
ignore_default_excludes = false
# 需要排除的变量模式。默认空数组
exclude = []
# 强制设置的键值。默认空对象
set = {}
# 白名单，非空时只保留匹配的变量
include_only = []
# 是否通过用户 shell profile 启动子进程。默认 false
experimental_use_profile = false

################################################################################
# 网络代理与权限
################################################################################

[permissions.network]
# enabled = true
# proxy_url = "http://127.0.0.1:43128"
# admin_url = "http://127.0.0.1:43129"
# enable_socks5 = false
# socks_url = "http://127.0.0.1:43130"
# enable_socks5_udp = false
# allow_upstream_proxy = false
# dangerously_allow_non_loopback_proxy = false
# dangerously_allow_non_loopback_admin = false
# dangerously_allow_all_unix_sockets = false
# mode = "limited"                           # limited | full
# allowed_domains = ["api.openai.com"]
# denied_domains = ["example.com"]
# allow_unix_sockets = ["/var/run/docker.sock"]
# allow_local_binding = false

################################################################################
# 历史记录
################################################################################

[history]
# save-all 默认 | none
persistence = "save-all"
# 历史文件最大字节数，超限会裁剪旧记录。示例 5242880
# max_bytes = 5242880

################################################################################
# TUI 与杂项
################################################################################

[tui]
# TUI 桌面通知。默认 true
# 示例 false 或 ["agent-turn-complete", "approval-requested"]
notifications = false

# 终端通知方式: auto | osc9 | bel。默认 auto
# notification_method = "auto"

# 启用欢迎页、状态、动画。默认 true
animations = true

# 显示欢迎页提示。默认 true
show_tooltips = true

# alternate screen 使用策略。默认 auto
# alternate_screen = "auto"

# 底部状态栏条目顺序。不设置时默认
# ["model-with-reasoning", "context-remaining", "current-dir"]
# 设为 [] 可隐藏
# status_line = ["model", "context-remaining", "git-branch"]

# 主题名称。可用 /theme 预览
# theme = "catppuccin-mocha"

# 内部模型提示状态，通常由 Codex 管理
# [tui.model_availability_nux]
# "gpt-5.4" = 1

# 是否启用 analytics。默认由 Codex 控制
[analytics]
enabled = true

# 是否允许通过 /feedback 提交反馈
[feedback]
enabled = true

# 内部提示状态，通常由 Codex 写入
[notice]
# hide_full_access_warning = true
# hide_world_writable_warning = true
# hide_rate_limit_model_nudge = true
# hide_gpt5_1_migration_prompt = true
# "hide_gpt-5.1-codex-max_migration_prompt" = true
# model_migrations = { "gpt-4.1" = "gpt-5.1" }

################################################################################
# 集中式功能开关
################################################################################

[features]
# 不填写表示接受默认值。填写布尔值表示显式开启或关闭
# shell_tool = true
# apps = false
# apps_mcp_gateway = false
# unified_exec = false
# shell_snapshot = false
# multi_agent = false
# personality = true
# use_linux_sandbox_bwrap = false
# runtime_metrics = true
# powershell_utf8 = true
# child_agents_md = false
# sqlite = true
# fast_mode = true
# enable_request_compression = true
# image_generation = false
# skill_mcp_dependency_install = true
# skill_env_var_dependency_prompt = false
# default_mode_request_user_input = false
# artifact = false
# prevent_idle_sleep = false
# responses_websockets = false
# responses_websockets_v2 = false
# image_detail_original = false

################################################################################
# MCP 服务器
################################################################################

[mcp_servers]

# 示例 STDIO 传输
# [mcp_servers.docs]
# enabled = true
# required = true
# command = "docs-server"
# args = ["--port", "4000"]
# env = { "API_KEY" = "value" }
# env_vars = ["ANOTHER_SECRET"]
# cwd = "/path/to/server"
# startup_timeout_sec = 10.0
# # startup_timeout_ms = 10000
# tool_timeout_sec = 60.0
# enabled_tools = ["search", "summarize"]
# disabled_tools = ["slow-tool"]
# scopes = ["read:docs"]
# oauth_resource = "https://docs.example.com/"

# 示例 Streamable HTTP 传输
# [mcp_servers.github]
# enabled = true
# required = true
# url = "https://github-mcp.example.com/mcp"
# bearer_token_env_var = "GITHUB_TOKEN"
# http_headers = { "X-Example" = "value" }
# env_http_headers = { "X-Auth" = "AUTH_ENV" }
# startup_timeout_sec = 10.0
# tool_timeout_sec = 60.0
# enabled_tools = ["list_issues"]
# disabled_tools = ["delete_issue"]
# scopes = ["repo"]

################################################################################
# 模型提供商
################################################################################

# 内置包含 openai、ollama、lmstudio

[model_providers]

# 示例 OpenAI 数据驻留
# [model_providers.openaidr]
# name = "OpenAI Data Residency"
# base_url = "https://us.api.openai.com/v1"
# wire_api = "responses"
# # requires_openai_auth = true
# # request_max_retries = 4
# # stream_max_retries = 5
# # stream_idle_timeout_ms = 300000
# # supports_websockets = true
# # experimental_bearer_token = "sk-example"
# # http_headers = { "X-Example" = "value" }
# # env_http_headers = { "OpenAI-Organization" = "OPENAI_ORGANIZATION", "OpenAI-Project" = "OPENAI_PROJECT" }

# 示例 Azure 兼容
# [model_providers.azure]
# name = "Azure"
# base_url = "https://YOUR_PROJECT_NAME.openai.azure.com/openai"
# wire_api = "responses"
# query_params = { api-version = "2025-04-01-preview" }
# env_key = "AZURE_OPENAI_API_KEY"
# env_key_instructions = "Set AZURE_OPENAI_API_KEY in your environment"
# # supports_websockets = false

# 示例本地 OSS
# [model_providers.ollama]
# name = "Ollama"
# base_url = "http://localhost:11434/v1"
# wire_api = "responses"

################################################################################
# Apps 与 Connectors
################################################################################

[apps]
# [_default] 作用于所有 app，除非被单独覆盖
# [apps._default]
# enabled = true
# destructive_enabled = true
# open_world_enabled = true
#
# [apps.google_drive]
# enabled = false
# destructive_enabled = false
# default_tools_enabled = true
# default_tools_approval_mode = "prompt"  # auto | prompt | approve
#
# [apps.google_drive.tools."files/delete"]
# enabled = false
# approval_mode = "approve"

################################################################################
# Profiles 预设
################################################################################

[profiles]

# [profiles.default]
# model = "gpt-5.4"
# model_provider = "openai"
# approval_policy = "on-request"
# sandbox_mode = "read-only"
# service_tier = "flex"
# oss_provider = "ollama"
# model_reasoning_effort = "medium"
# plan_mode_reasoning_effort = "high"
# model_reasoning_summary = "auto"
# model_verbosity = "medium"
# personality = "pragmatic"  # 或 friendly 或 none
# chatgpt_base_url = "https://chatgpt.com/backend-api/"
# model_catalog_json = "./models.json"
# model_instructions_file = "/absolute/or/relative/path/to/instructions.txt"
# experimental_compact_prompt_file = "./compact_prompt.txt"
# tools_view_image = true
# features = { unified_exec = false }

################################################################################
# Projects 信任映射
################################################################################

[projects]
# 标记具体项目的信任等级
# [projects."/absolute/path/to/project"]
# trust_level = "trusted"  # 或 untrusted

################################################################################
# Tools
################################################################################

[tools]
# view_image = true

################################################################################
# OpenTelemetry
################################################################################

[otel]
# 是否把用户提示文本写入日志。默认 false
log_user_prompt = false
# 环境标签。默认 dev
environment = "dev"
# Exporter: none 默认 | otlp-http | otlp-grpc
exporter = "none"
# Trace exporter: none 默认 | otlp-http | otlp-grpc
trace_exporter = "none"
# Metrics exporter: none | statsig | otlp-http | otlp-grpc
metrics_exporter = "statsig"

# OTLP/HTTP exporter 示例
# [otel.exporter."otlp-http"]
# endpoint = "https://otel.example.com/v1/logs"
# protocol = "binary"  # "binary" | "json"

# [otel.exporter."otlp-http".headers]
# "x-otlp-api-key" = "${OTLP_TOKEN}"

# [otel.exporter."otlp-http".tls]
# ca-certificate = "certs/otel-ca.pem"
# client-certificate = "/etc/codex/certs/client.pem"
# client-private-key = "/etc/codex/certs/client-key.pem"

# OTLP/gRPC trace exporter 示例
# [otel.trace_exporter."otlp-grpc"]
# endpoint = "https://otel.example.com:4317"
# headers = { "x-otlp-meta" = "abc123" }

################################################################################
# Windows
################################################################################

[windows]
# Windows 原生沙箱模式: unelevated | elevated
sandbox = "unelevated"