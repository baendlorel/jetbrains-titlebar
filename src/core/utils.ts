import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { GLOW_COLORS } from '@/lib/colors';

export function hashIndex(input: string): number {
  const hash = createHash('sha1').update(input).digest();
  const num = (BigInt(hash.readUInt32BE(0)) << 32n) | BigInt(hash.readUInt32BE(4));

  const result = Number(num & 0x7fffffffffffffffn); // Keep it positive
  return result % GLOW_COLORS.length;
}

export function getProjectInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    return '';
  }

  const normalized = trimmed
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[._\-\\/]+/g, ' ')
    .replace(/\s+/g, ' ');

  const tokens = normalized.split(' ').filter(Boolean);
  const initials: string[] = [];

  for (const token of tokens) {
    if (initials.length >= 2) {
      break;
    }
    const match = token.match(/[\p{L}\p{N}]/u);
    if (match) {
      initials.push(match[0]);
    }
  }

  if (initials.length >= 2) {
    return initials.slice(0, 2).join('').toLocaleUpperCase();
  }

  const fallback = Array.from(trimmed.matchAll(/[\p{L}\p{N}]/gu), (m) => m[0]);
  if (fallback.length === 0) {
    return '';
  }

  return fallback.slice(0, 2).join('').toLocaleUpperCase();
}

/**
 * Search for workbench.desktop.main.css in common locations
 */
export async function searchWorkbenchCss(): Promise<string | null> {
  const possiblePaths: string[] = [];
  const home = homedir();
  const platform = process.platform;

  // Determine VS Code installation paths based on platform
  if (platform === 'win32') {
    // Windows paths
    const appData = process.env.LOCALAPPDATA || join(home, 'AppData', 'Local');
    possiblePaths.push(
      join(
        appData,
        'Programs',
        'Microsoft VS Code',
        'resources',
        'app',
        'out',
        'vs',
        'workbench',
        'workbench.desktop.main.css',
      ),
      join(
        appData,
        'Programs',
        'Microsoft VS Code Insiders',
        'resources',
        'app',
        'out',
        'vs',
        'workbench',
        'workbench.desktop.main.css',
      ),
      join(
        'C:',
        'Program Files',
        'Microsoft VS Code',
        'resources',
        'app',
        'out',
        'vs',
        'workbench',
        'workbench.desktop.main.css',
      ),
      join(
        'C:',
        'Program Files',
        'Microsoft VS Code Insiders',
        'resources',
        'app',
        'out',
        'vs',
        'workbench',
        'workbench.desktop.main.css',
      ),
    );
  } else if (platform === 'darwin') {
    // macOS paths
    possiblePaths.push(
      '/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/workbench/workbench.desktop.main.css',
      '/Applications/Visual Studio Code - Insiders.app/Contents/Resources/app/out/vs/workbench/workbench.desktop.main.css',
      join(
        home,
        'Applications',
        'Visual Studio Code.app',
        'Contents',
        'Resources',
        'app',
        'out',
        'vs',
        'workbench',
        'workbench.desktop.main.css',
      ),
      join(
        home,
        'Applications',
        'Visual Studio Code - Insiders.app',
        'Contents',
        'Resources',
        'app',
        'out',
        'vs',
        'workbench',
        'workbench.desktop.main.css',
      ),
    );
  } else {
    // Linux paths
    possiblePaths.push(
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
    );
  }

  possiblePaths.push('/mnt/c/Programs/Microsoft VS Code/resources/app/out/vs/workbench/workbench.desktop.main.css');
  possiblePaths.push('/mnt/d/Programs/Microsoft VS Code/resources/app/out/vs/workbench/workbench.desktop.main.css');
  possiblePaths.push('/mnt/e/Programs/Microsoft VS Code/resources/app/out/vs/workbench/workbench.desktop.main.css');
  possiblePaths.push('/mnt/f/Programs/Microsoft VS Code/resources/app/out/vs/workbench/workbench.desktop.main.css');

  // Check each path
  for (const path of possiblePaths) {
    if (existsSync(path)) {
      return path;
    }
  }

  return null;
}
