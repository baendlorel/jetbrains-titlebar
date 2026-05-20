import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import isWsl from 'is-wsl';
import { env } from 'vscode';

const buildCssPath = (...parts: string[]) => join(...parts, 'out', 'vs', 'workbench', 'workbench.desktop.main.css');

const splitOutputLines = (output: string): string[] =>
  output
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean);

const toWslPath = (windowsPath: string): string | null => {
  try {
    const converted = execFileSync('wslpath', ['-u', windowsPath], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return converted || null;
  } catch {
    const normalized = windowsPath.replace(/\\/gu, '/');
    const match = /^([a-z]):(\/.*)$/iu.exec(normalized);
    if (!match) {
      return null;
    }
    return `/mnt/${match[1].toLowerCase()}${match[2]}`;
  }
};

const getWslWindowsCssPaths = (): string[] => {
  const script = [
    '$paths = @(',
    "  (Join-Path $env:LOCALAPPDATA 'Programs\\Microsoft VS Code\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.css'),",
    "  (Join-Path $env:LOCALAPPDATA 'Programs\\Microsoft VS Code Insiders\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.css'),",
    "  (Join-Path $env:ProgramFiles 'Microsoft VS Code\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.css'),",
    "  (Join-Path $env:ProgramFiles 'Microsoft VS Code Insiders\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.css'),",
    "  (Join-Path ${env:ProgramFiles(x86)} 'Microsoft VS Code\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.css'),",
    "  (Join-Path ${env:ProgramFiles(x86)} 'Microsoft VS Code Insiders\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.css')",
    ')',
    "$commands = @('code.cmd', 'code-insiders.cmd') | ForEach-Object { Get-Command $_ -CommandType Application -ErrorAction SilentlyContinue } | Where-Object { $_ }",
    "$commandPaths = $commands | ForEach-Object { Join-Path (Split-Path (Split-Path $_.Source -Parent) -Parent) 'resources\\app\\out\\vs\\workbench\\workbench.desktop.main.css' }",
    '($paths + $commandPaths) | Where-Object { $_ -and (Test-Path $_) } | Select-Object -Unique',
  ].join('; ');

  try {
    const output = execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', script], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });

    return splitOutputLines(output)
      .map(toWslPath)
      .filter((candidate): candidate is string => Boolean(candidate));
  } catch {
    return [];
  }
};

/**
 * Search for workbench.desktop.main.css in common locations
 */
export const searchCssPath = async (): Promise<string | null> => {
  const paths = new Set<string>();
  const home = homedir();
  const platform = process.platform;

  if (!isWsl) {
    paths.add(buildCssPath(env.appRoot));
  }

  // Determine VS Code installation paths based on platform
  if (platform === 'win32') {
    // Windows paths
    const appData = process.env.LOCALAPPDATA || join(home, 'AppData', 'Local');
    [
      buildCssPath(appData, 'Programs', 'Microsoft VS Code', 'resources', 'app'),
      buildCssPath(appData, 'Programs', 'Microsoft VS Code Insiders', 'resources', 'app'),
      buildCssPath('C:', 'Program Files', 'Microsoft VS Code', 'resources', 'app'),
      buildCssPath('C:', 'Program Files', 'Microsoft VS Code Insiders', 'resources', 'app'),
    ].forEach((candidate) => paths.add(candidate));
  } else if (platform === 'darwin') {
    // macOS paths
    [
      '/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/workbench/workbench.desktop.main.css',
      '/Applications/Visual Studio Code - Insiders.app/Contents/Resources/app/out/vs/workbench/workbench.desktop.main.css',
      buildCssPath(home, 'Applications', 'Visual Studio Code.app', 'Contents', 'Resources', 'app'),
      buildCssPath(home, 'Applications', 'Visual Studio Code - Insiders.app', 'Contents', 'Resources', 'app'),
    ].forEach((candidate) => paths.add(candidate));
  } else {
    // Linux paths
    [
      '/usr/share/code/resources/app/out/vs/workbench/workbench.desktop.main.css',
      '/usr/share/code-insiders/resources/app/out/vs/workbench/workbench.desktop.main.css',
      '/opt/visual-studio-code/resources/app/out/vs/workbench/workbench.desktop.main.css',
      '/opt/VSCode-linux-x64/resources/app/out/vs/workbench/workbench.desktop.main.css',
      join(home, '.vscode', 'extensions', '**', 'workbench.desktop.main.css'),
      // Flatpak
      join(
        home,
        '.var',
        'app',
        'com.visualstudio.code',
        'data',
        'code',
        'resources',
        'app',
        'out',
        'vs',
        'workbench',
        'workbench.desktop.main.css',
      ),
      // Snap
      '/snap/code/current/usr/share/code/resources/app/out/vs/workbench/workbench.desktop.main.css',
    ].forEach((candidate) => paths.add(candidate));
  }

  if (isWsl) {
    getWslWindowsCssPaths().forEach((candidate) => paths.add(candidate));
  }

  // TODO 这里还可能是Program Data等多个文件。可以采取的策略是对每一个盘进行一次2层搜索，优先搜索Pro开头的，因为可能是program/program files。
  paths.add('/mnt/c/Programs/Microsoft VS Code/resources/app/out/vs/workbench/workbench.desktop.main.css');
  paths.add('/mnt/d/Programs/Microsoft VS Code/resources/app/out/vs/workbench/workbench.desktop.main.css');
  paths.add('/mnt/e/Programs/Microsoft VS Code/resources/app/out/vs/workbench/workbench.desktop.main.css');
  paths.add('/mnt/f/Programs/Microsoft VS Code/resources/app/out/vs/workbench/workbench.desktop.main.css');

  // Check each path
  for (const path of paths) {
    if (existsSync(path)) {
      return path;
    }
  }

  return null;
};
