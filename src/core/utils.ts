import { workspace } from 'vscode';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

/**
 * Calculate a hash from a string
 */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Get color index from workspace folder name
 */
export function getColorIndexFromWorkspace(): number {
  const workspaceFolders = workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    return 0;
  }

  const folderName = workspaceFolders[0].name;
  const colors = getCssColors();
  const hash = hashString(folderName);
  return hash % colors.length;
}

/**
 * Get CSS colors array
 */
export function getCssColors(): string[] {
  return '#990000,#a80000,#b60000,#c50000,#d30000,#e20000,#f00000,#ff0000,#991d00,#a81f00,#b62200,#c52500,#d32800,#e22a00,#f02d00,#ff3000,#993900,#a83f00,#b64400,#c54a00,#d34f00,#e25500,#f05a00,#ff6000,#995600,#a85e00,#b66600,#c56f00,#d37700,#e27f00,#f08700,#ff8f00,#997300,#a87e00,#b68900,#c59400,#d39e00,#e2a900,#f0b400,#ffbf00,#998f00,#a89d00,#b6ab00,#c5b800,#d3c600,#e2d400,#f0e100,#ffef00,#869900,#93a800,#9fb600,#acc500,#b9d300,#c6e200,#d2f000,#dfff00,#699900,#73a800,#7db600,#87c500,#91d300,#9be200,#a5f000,#afff00,#4d9900,#54a800,#5bb600,#62c500,#6ad300,#71e200,#78f000,#7fff00,#309900,#34a800,#39b600,#3dc500,#42d300,#47e200,#4bf000,#50ff00,#139900,#15a800,#17b600,#19c500,#1ad300,#1ce200,#1ef000,#20ff00,#00990a,#00a80a,#00b60b,#00c50c,#00d30d,#00e20e,#00f00f,#00ff10,#009926,#00a82a,#00b62e,#00c531,#00d335,#00e238,#00f03c,#00ff40,#009943,#00a849,#00b650,#00c556,#00d35c,#00e263,#00f069,#00ff70,#009960,#00a869,#00b672,#00c57b,#00d384,#00e28d,#00f096,#00ff9f,#00997c,#00a888,#00b694,#00c5a0,#00d3ac,#00e2b8,#00f0c3,#00ffcf,#009999,#00a8a8,#00b6b6,#00c5c5,#00d3d3,#00e2e2,#00f0f0,#00ffff,#007c99,#0088a8,#0094b6,#00a0c5,#00acd3,#00b8e2,#00c3f0,#00cfff,#006099,#0069a8,#0072b6,#007bc5,#0084d3,#008de2,#0096f0,#009fff,#004399,#0049a8,#0050b6,#0056c5,#005cd3,#0063e2,#0069f0,#0070ff,#002699,#002aa8,#002eb6,#0031c5,#0035d3,#0038e2,#003cf0,#0040ff,#000a99,#000aa8,#000bb6,#000cc5,#000dd3,#000ee2,#000ff0,#0010ff,#130099,#1500a8,#1700b6,#1900c5,#1a00d3,#1c00e2,#1e00f0,#2000ff,#300099,#3400a8,#3900b6,#3d00c5,#4200d3,#4700e2,#4b00f0,#5000ff,#4c0099,#5400a8,#5b00b6,#6200c5,#6a00d3,#7100e2,#7800f0,#7f00ff,#690099,#7300a8,#7d00b6,#8700c5,#9100d3,#9b00e2,#a500f0,#af00ff,#860099,#9300a8,#9f00b6,#ac00c5,#b900d3,#c600e2,#d200f0,#df00ff,#99008f,#a8009d,#b600ab,#c500b8,#d300c6,#e200d4,#f000e1,#ff00ef,#990073,#a8007e,#b60089,#c50094,#d3009e,#e200a9,#f000b4,#ff00bf,#990056,#a8005e,#b60066,#c5006f,#d30077,#e2007f,#f00087,#ff008f,#990039,#a8003f,#b60044,#c5004a,#d3004f,#e20055,#f0005a,#ff0060,#99001d,#a8001f,#b60022,#c50025,#d30028,#e2002a,#f0002d,#ff0030'.split(
    ','
  );
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

  possiblePaths.push(
    '/mnt/d/Programs/Microsoft VS Code/resources/app/out/vs/workbench/workbench.desktop.main.css'
  );

  // Check each path
  for (const path of possiblePaths) {
    if (existsSync(path)) {
      return path;
    }
  }

  return null;
}
