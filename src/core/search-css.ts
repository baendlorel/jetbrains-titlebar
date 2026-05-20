import { $info } from '@/lib/native';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

/**
 * Search for workbench.desktop.main.css in common locations
 */
export const searchCssPath = async (): Promise<string | null> => {
  const paths: string[] = [];
  const home = homedir();
  const platform = process.platform;

  // Determine VS Code installation paths based on platform
  if (platform === 'win32') {
    // Windows paths
    const appData = process.env.LOCALAPPDATA || join(home, 'AppData', 'Local');
    paths.push(
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
    paths.push(
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
    paths.push(
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

  // TODO 这里还可能是Program Data等多个文件。可以采取的策略是对每一个盘进行一次2层搜索，优先搜索Pro开头的，因为可能是program/program files。
  paths.push('/mnt/c/Programs/Microsoft VS Code/resources/app/out/vs/workbench/workbench.desktop.main.css');
  paths.push('/mnt/d/Programs/Microsoft VS Code/resources/app/out/vs/workbench/workbench.desktop.main.css');
  paths.push('/mnt/e/Programs/Microsoft VS Code/resources/app/out/vs/workbench/workbench.desktop.main.css');
  paths.push('/mnt/f/Programs/Microsoft VS Code/resources/app/out/vs/workbench/workbench.desktop.main.css');

  // Check each path
  for (const path of paths) {
    if (existsSync(path)) {
      return path;
    }
  }

  return null;
};
