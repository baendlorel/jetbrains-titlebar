import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { GLOW_COLORS } from '@/lib/colors';

export function hashString(str: string): number {
  const hash = createHash('md5').update(str).digest('hex');
  const i = parseInt(hash.slice(0, 8), 16);
  // let hash = 0;
  // for (let i = 0; i < str.length; i++) {
  //   const char = str.charCodeAt(i);
  //   hash = (hash << 5) - hash + char;
  //   hash = hash & hash; // Convert to 32bit integer
  // }
  // return Math.abs(i);
  const t = i % GLOW_COLORS.length;
  console.log('hashedindex', t);
  return t;
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
        'workbench.desktop.main.css'
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
        'workbench.desktop.main.css'
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
        'workbench.desktop.main.css'
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
        'workbench.desktop.main.css'
      )
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
        'workbench.desktop.main.css'
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
        'workbench.desktop.main.css'
      )
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
        'workbench.desktop.main.css'
      ),
      // Snap
      '/snap/code/current/usr/share/code/resources/app/out/vs/workbench/workbench.desktop.main.css'
    );
  }

  // #if DEBUG
  possiblePaths.push(
    '/mnt/d/Programs/Microsoft VS Code/resources/app/out/vs/workbench/workbench.desktop.main.css'
  );
  // #endif

  // Check each path
  for (const path of possiblePaths) {
    if (existsSync(path)) {
      return path;
    }
  }

  return null;
}
