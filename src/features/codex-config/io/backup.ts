import { copyFileSync, existsSync } from "node:fs";

function formatBackupTimestamp(now: Date) {
  return now.toISOString().replace(/[:]/g, "-");
}

export function createBackupPath(targetPath: string, now = new Date()) {
  return `${targetPath}.bak.${formatBackupTimestamp(now)}`;
}

export function createBackupIfExists(targetPath: string, now = new Date()) {
  if (!existsSync(targetPath)) {
    return null;
  }

  const backupPath = createBackupPath(targetPath, now);
  copyFileSync(targetPath, backupPath);
  return backupPath;
}