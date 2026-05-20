import vscode from 'vscode';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import isWsl from 'is-wsl';
import { errorPop } from '@/lib/native';

/**
 * Search for workbench.desktop.main.css in common locations
 */
export const searchCssPath = async (): Promise<string | null> => {
  return (
    [vscode.env.appRoot, getWindowsPathInWsl()]
      .filter((v): v is string => v !== null)
      .map((v) => path.join(v, 'resources', 'app', 'out', 'vs', 'workbench', 'workbench.desktop.main.css'))
      .find(existsSync) ?? null
  );
};

const tryExec = (command: string): string | null => {
  try {
    return execSync(command, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch (error) {
    errorPop(error as Error);
    return null;
  }
};

// Microsoft VS Code\0958016b2a\resources\app\out\vs\workbench
// winSource => \Microsoft VS Code\bin\code.cmd
// wslpath -u xxx => /mnt/c/Users/<user>/AppData/Local/Programs/Microsoft VS Code/bin/code.cmd
/**
 * Returns null if not in WSL or if any step fails, otherwise returns the WSL path to the VS Code resources directory
 */
import pathWin from 'node:path/win32';
function getWindowsPathInWsl() {
  if (!isWsl) {
    return null;
  }

  const winSource = tryExec(`powershell.exe -Command "(Get-Command code).Source"`);
  if (winSource === null) {
    return null;
  }

  const dir = pathWin.dirname(winSource);
  const wslDir = tryExec(`wslpath -u "${dir}"`);
  if (wslDir === null) {
    return null;
  }

  const codeFileContent = readFileSync(path.join(wslDir, 'code'), 'utf-8');
  const folder = codeFileContent.match(/VERSIONFOLDER=([^\n]+)\n/)?.[1];
  if (!folder) {
    return null;
  }

  return path.join(wslDir, folder);
}
