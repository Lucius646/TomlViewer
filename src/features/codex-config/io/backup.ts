import { constants, copyFileSync, existsSync } from "node:fs";

function formatBackupTimestamp(now: Date) {
  return now.toISOString().replace(/[:]/g, "-");
}

export function createBackupPath(targetPath: string, now = new Date(), attempt = 0) {
  const basePath = `${targetPath}.bak.${formatBackupTimestamp(now)}`;

  return attempt === 0 ? basePath : `${basePath}.${attempt}`;
}

export function createBackupIfExists(targetPath: string, now = new Date()) {
  if (!existsSync(targetPath)) {
    return null;
  }

  let attempt = 0;

  while (true) {
    const backupPath = createBackupPath(targetPath, now, attempt);

    try {
      copyFileSync(targetPath, backupPath, constants.COPYFILE_EXCL);
      return backupPath;
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;

      if (nodeError.code !== "EEXIST") {
        throw error;
      }

      attempt += 1;
    }
  }
}