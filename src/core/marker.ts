import { StatusBarAlignment, StatusBarItem, window, workspace } from 'vscode';
import { getProjectInitials, hashIndex } from './utils.js';

export class Marker {
  static readonly instance = new Marker();

  readonly item: StatusBarItem;
  initialItem: StatusBarItem | null = null;

  constructor() {
    this.item = window.createStatusBarItem(StatusBarAlignment.Left, -Infinity);
    this.update();

    // #if DEBUG
    this.item.color = 'red';
    // #else
    this.item.color = 'transparent';
    // #endif

    this.item.show();

    // todo 根据设置判断是否要创建
    this.createInitialItem();
  }

  createInitialItem() {
    this.initialItem = window.createStatusBarItem('project-initials', StatusBarAlignment.Left, -Infinity);
    this.initialItem.color = '#f7f8faaf';
    this.initialItem.show();
  }

  update() {
    this.item.text = this._getColorIndex().toString();

    // todo 根据设置判断是否要创建
    if (this.initialItem) {
      this.initialItem.text = this._getProjectInitials();
    }
  }

  private _getColorIndex(): number {
    const workspaceFolders = workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      return 0;
    }

    const folderName = workspaceFolders[0].name;

    // Mix in color seed if configured
    const config = workspace.getConfiguration('jetbrains-titlebar');
    const colorSeed = config.get<string>('colorSeed', '');
    const mixedName = colorSeed ? `${folderName}::${colorSeed}` : folderName;

    return hashIndex(mixedName);
  }

  private _getProjectInitials(): string {
    const workspaceFolders = workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      return '';
    }
    return getProjectInitials(workspaceFolders[0].name);
  }
}
