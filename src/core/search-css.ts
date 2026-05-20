import vscode from 'vscode';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { $err, errorPop, t } from '@/lib/native.js';

/**
 * Search for workbench.desktop.main.css in common locations
 */
export const searchCssPath = async (): Promise<string | null> => {
  const list = [vscode.env.appRoot, getWindowsPathInWsl()]
    .filter((v): v is string => v !== null)
    .map((v) => [
      path.join(v, 'resources', 'app', 'out', 'vs', 'workbench', 'workbench.desktop.main.css'),
      path.join(v, 'out', 'vs', 'workbench', 'workbench.desktop.main.css'),
    ])
    .flat();

  vscode.window.showInformationMessage(`Searching for CSS in: ${list.join(', ')}`);
  vscode.window.showInformationMessage(`Searching for CSS in: ${list.map(existsSync).join(', ')}`);

  return list.find(existsSync) ?? null;
};
// D:\\ProgramData\\Microsoft VS Code\\0958016b2a\\resources\\app\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.css
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
/**
 * Returns null if not in WSL or if any step fails, otherwise returns the WSL path to the VS Code resources directory
 */
const getWindowsPathInWsl = () => {
  if (vscode.env.remoteName !== 'wsl') {
    return null;
  }

  // ! Wired, the command below returns same result in WSL and Powershell (D:\ProgramData\Microsoft VS Code\bin\code.cmd)
  // ! But different from exec in vscode plugin environment (D:\ProgramData\Microsoft VS Code\Code.exe)
  const winSource = tryExec(`powershell.exe -Command "(Get-Command code).Source"`);
  if (!winSource) {
    return null;
  }

  const wslDir = path.win32.dirname(winSource);
  const codeShellPaths = [path.win32.join(wslDir, 'code'), path.win32.join(wslDir, 'bin', 'code')];
  const codeShellPath = codeShellPaths.find(existsSync);
  if (!codeShellPath) {
    $err(t('search-css.code-shell-not-found', codeShellPaths.join(', ')));
    return null;
  }

  const codeFileContent = readFileSync(codeShellPath, 'utf-8');
  const folder = codeFileContent.match(/VERSIONFOLDER=([^\n]+)\n/)?.[1];
  if (!folder) {
    $err(t('search-css.code-shell-invalid'));
    return null;
  }

  return path.win32.dirname(path.win32.dirname(codeShellPath)); // Gets ...\Microsoft VS Code\
};
