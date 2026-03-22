# Codex 配置编辑器设计稿

## 目标

构建一个仅支持 Windows 的本地 Web 应用，用可视化界面编辑 Codex `config.toml`，提供逐字段中文说明、真实文件直接读写能力，以及可选的专家模式原始 TOML 兜底编辑区。

该产品应允许不懂 TOML 的用户安全地编辑：

- 用户级 / 全局配置：`C:\Users\<user>\.codex\config.toml`
- 项目级 / 局部配置：`<project>\.codex\config.toml`

## 产品定位

这不是一个通用 TOML 查看器，而是一个理解 Codex 配置语义的配置编辑器。它需要知道：

- 配置层级与覆盖顺序
- 哪些设置更安全，哪些设置风险更高
- 哪些设置更适合放在全局层，哪些更适合项目层
- 哪些配置是普通字段，哪些配置是命名对象集合
- 项目内 `.codex\config.toml` 与全局配置中的 `[projects."<path>"]` 信任映射不是同一回事

界面必须默认用户不懂 TOML。

## 范围

### V1 包含

- 仅支持 Windows
- 本地 Web App，直接读写真实文件
- 全局配置编辑
- 项目配置编辑
- 基于元数据的中文字段说明
- 常用与高级字段的可视化表单
- 以下命名集合的专用子界面：
  - `profiles`
  - `model_providers`
  - `projects` 信任映射
- 默认折叠的专家模式原始 TOML 编辑区
- 保存时保留未知字段与未支持结构
- 写回前自动备份
- 显示全局/项目层的最终生效值来源

### V1 不包含

- macOS / Linux 支持
- 桌面壳打包
- 所有复杂结构的完整可视化管理
- 以下部分的完整可视化编辑：
  - `apps`
  - `otel`
  - `skills.config`
  - 全部 `agents.*` 子结构
  - 全部 `mcp_servers` 变体
- 多设备同步
- 远程文件编辑

对于 V1 不支持可视化管理的复杂结构，要求在保存时保留，并通过专家模式兜底，而不是丢弃。

## 目标用户

核心用户是在 Windows 上使用 Codex CLI、希望安全调整配置、但不愿手写 TOML 的用户。用户通常只有在界面明确解释字段用途时，才能理解配置含义。

## 核心体验原则

1. 先解释，再编辑
2. 安全优先于速度
3. 必须直接编辑真实配置文件，而不是仅支持导入导出
4. 必须始终明确当前是在编辑全局层还是项目层
5. 不认识的字段也不能在保存后丢失

## 信息架构

应用采用“说明优先”的布局。

### 顶层模式

- `全局配置`
- `项目配置`

### 主布局

- 左侧：分组导航
- 中间：字段表单与简短说明
- 右侧：当前层级、覆盖关系、风险提示、保存状态、备份信息

### 左侧分组

- 核心模型
- 推理与输出
- 安全与沙箱
- 搜索与体验
- 历史与通知
- Profiles
- Model Providers
- Projects 信任
- 专家模式

## 字段说明模型

每个可视化字段都必须具备以下信息：

- 中文名称
- 原始 TOML 键名
- 一句话用途说明
- 当前值
- 未设置时的默认行为
- 推荐放置层级：全局 / 项目
- 风险等级（如适用）
- 枚举型字段的可选值说明
- 可展开的详细说明区域

### 默认展示方式

默认只展示简短中文说明。用户展开后可看到：

- 详细解释
- 默认行为
- TOML 示例
- 相关字段
- 层级建议
- 风险提示

这样既能保持页面可读性，又不会把重要语义藏起来。

## 配置分区与 V1 编辑策略

### 1. 常用标量 / 小型表结构

以下字段在 V1 中应完整支持可视化编辑：

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

### 2. 命名对象集合编辑器

这类配置不适合普通表单，需要“列表 + 详情”的专门子界面。

#### `profiles`

- 展示所有 profile 名称
- 支持新增、重命名、删除
- 通过同一套元数据系统编辑受支持字段

#### `model_providers`

- 展示 provider 列表
- 支持新增、编辑、删除
- V1 支持的字段包括：
  - `name`
  - `base_url`
  - `wire_api`
  - `env_key`
  - `env_key_instructions`
  - `query_params`
  - `http_headers`
  - `env_http_headers`

#### `projects`

这里应被视为“全局配置中的项目信任映射管理器”，而不是项目级配置文件编辑器。

- 展示受信任 / 不受信任的项目路径
- 支持新增、编辑、删除映射
- 明确说明它保存在全局配置里
- 明确说明它和 `<project>\.codex\config.toml` 不是同一个东西

### 3. 专家模式兜底

专家模式默认折叠。

它应提供：

- 原始 TOML 文本编辑区
- 未支持 / 未知字段可见性
- “仅供高级用户使用”的警告
- 即使通过原始 TOML 保存，也必须走备份、校验、保留未知字段的同一套保存链路

## 全局与项目编辑行为

### 全局模式

- 读取 `C:\Users\<user>\.codex\config.toml`
- 允许编辑全局字段与 `projects` 信任映射

### 项目模式

- 用户输入或选择项目路径
- 应用解析 `<project>\.codex\config.toml`
- 若文件不存在，界面提供“创建项目配置”入口
- 明确提示：项目配置会覆盖该项目下的全局值
- 明确提示：如果项目是 `untrusted`，Codex 可能不会应用项目级配置

### 覆盖关系提示

界面必须明确教会用户：

- 项目配置会覆盖全局配置
- 全局配置中的 `[projects."<path>"]` 只是信任信息
- 项目内 `.codex\config.toml` 是另一份真正参与覆盖的配置文件

## 数据结构分层

实现上应至少拆成 4 层。

### 1. 字段元数据注册表

每个字段定义：

- key path
- 中文名称
- 描述
- 类型
- 默认行为说明
- 枚举值
- 推荐层级
- 风险标记
- 是否支持可视化编辑

### 2. 配置文档服务

负责：

- 读取文件
- 解析 TOML
- 保留未知内容
- 序列化写回 TOML
- 创建备份
- 安全写文件

### 3. 最终生效值解析器

负责：

- 告诉界面某个值来自哪里
- 区分显式设置、继承和默认值
- 在项目模式下展示覆盖关系

### 4. UI 层

负责：

- 根据元数据渲染表单
- 展示字段说明
- 展示校验错误
- 跟踪脏状态
- 处理保存交互

## 文件行为

### 读取路径

- 全局配置：Windows 当前用户目录下的 `~/.codex/config.toml`
- 项目配置：`<selected-project>\.codex\config.toml`

### 保存行为

每次写回前必须：

1. 校验输入
2. 必要时创建父目录
3. 若目标文件已存在，创建带时间戳的备份
4. 写入新的 TOML 内容
5. 在界面展示备份路径和最近修改时间

### 保留规则

保存后不能丢失：

- 未知顶层键
- 未支持的表结构
- 未编辑的复杂配置块

如果某部分还没有可视化支持，必须保留原始结构，并仅通过专家模式兜底编辑。

## 校验规则

### 强校验

以下情况必须阻止保存：

- 枚举值非法
- 数字字段不是合法数字
- 布尔字段值非法
- 新建命名对象时缺少必要字段
- 必填路径为空

### 软校验

以下情况允许保存，但必须给出明显提示：

- 在不推荐的层级编辑某字段
- 选择高风险值，例如更宽松的沙箱权限
- 当前项目未被信任，却正在编辑项目级配置

## 错误处理

界面应能明确展示这些错误：

- 配置文件不存在
- 配置文件不可读
- TOML 解析失败
- 字段值非法
- 备份失败
- 写入失败

当 TOML 无法解析时，不能静默覆盖，应清楚告诉用户问题所在，并提供专家模式恢复入口。

## 测试策略

V1 至少要覆盖：

- 读取现有全局配置
- 读取不存在的项目配置
- 新建项目 `.codex\config.toml`
- 编辑受支持的标量字段
- 编辑受支持的嵌套字段
- 编辑 `projects` 信任映射
- 保存后未知字段仍被保留
- 非法枚举值被拦截
- 写回前成功创建备份
- 项目模式下正确显示值来源

## 已锁定的设计决策

- 仅支持 Windows
- 采用本地 Web App
- 使用说明优先布局
- 默认展示简短说明，详情按需展开
- 同时支持全局与项目配置
- 专家模式默认隐藏
- 首页布局采用 A 方案，不以 TOML 实时预览为中心

## 风险

- Codex 配置会持续演进，字段元数据必须易于扩展
- TOML 回写时若库选型不当，未知结构保留会出问题
- 某些高级结构对 V1 来说过于复杂，必须保证“不会丢”优先于“全部可视化”

## 参考

- OpenAI Codex Config Basics
- OpenAI Codex Config Reference
- OpenAI Codex Sample Configuration
- 设计阶段观测到的本机用户配置：
  - `C:\Users\lucius\.codex\config.toml`
- 用户提供的字段整理：
  - `E:\LuciusProject\TomlViewer\部分toml属性.md`
