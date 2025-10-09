import { StatusBarAlignment, StatusBarItem, window, workspace } from 'vscode';
import { hashString } from './utils.js';
import { GLOW_COLORS } from '@/lib/colors.js';

export class Marker {
  readonly item: StatusBarItem;
  constructor() {
    this.item = window.createStatusBarItem(StatusBarAlignment.Left, -Infinity);
    this.update();

    // #if DEBUG
    this.item.color = 'red';
    // #else
    this.item.color = 'transparent';
    // #endif

    this.item.show();
  }

  update() {
    const colorIndex = this.getColorIndex();
    this.item.text = colorIndex.toString();
  }

  private getColorIndex(): number {
    const workspaceFolders = workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      return 0;
    }

    const folderName = workspaceFolders[0].name;

    // Mix in color seed if configured
    const config = workspace.getConfiguration('jetbrains-titlebar');
    const colorSeed = config.get<string>('colorSeed', '');
    const mixedName = colorSeed ? `${folderName}::${colorSeed}` : folderName;

    const hash = hashString(mixedName);
    return hash % GLOW_COLORS.length;
  }
}
