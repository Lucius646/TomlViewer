# Codex 配置编辑器

这是一个仅支持 Windows 的本地 Next.js 工具，用来可视化读取和修改 Codex 的 `config.toml`。

## 当前能力

- 支持全局配置与项目配置层级切换
- 常用字段提供中文说明、默认行为和风险提示
- 支持可视化编辑常用字段并直接保存到本机文件
- 支持 `profiles`、`model_providers`、`projects` 的集合编辑器
- 提供默认折叠的专家模式，可直接编辑原始 TOML

## 启动方式

```powershell
npm install
npm run dev
```

启动后打开浏览器访问：`http://localhost:3000`

## Windows 默认路径

- 全局配置：`C:\Users\<你的用户名>\.codex\config.toml`
- 项目配置：`<项目目录>\.codex\config.toml`

## 开发命令

```powershell
npm run test
npm run lint
npm run build
```