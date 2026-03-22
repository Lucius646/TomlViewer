function normalizeWindowsPathSegment(path: string) {
  return path.replace(/\\/g, "/").replace(/\/+$/, "");
}

export function resolveGlobalConfigPath(userHome: string) {
  return `${normalizeWindowsPathSegment(userHome)}/.codex/config.toml`;
}

export function resolveProjectConfigPath(projectRoot: string) {
  return `${normalizeWindowsPathSegment(projectRoot)}/.codex/config.toml`;
}