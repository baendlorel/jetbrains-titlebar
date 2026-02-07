import { StatusBarAlignment, StatusBarItem, window, workspace } from 'vscode';
import { getProjectInitials, hashIndex } from './utils.js';

export class Marker {
  static readonly instance = new Marker();

  readonly item: StatusBarItem;
  readonly initialsItemId = 'project-initials';
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

    this.syncInitialItem();
  }

  createInitialItem() {
    if (this.initialItem) {
      return;
    }
    this.initialItem = window.createStatusBarItem(this.initialsItemId, StatusBarAlignment.Left, -Infinity);
    this.initialItem.color = '#f7f8faaf';
    this.initialItem.show();
  }

  update() {
    this.item.text = this._getColorIndex().toString();

    this.syncInitialItem();
    if (this.initialItem) {
      this.initialItem.text = this._getProjectInitials();
    }
  }

  syncInitialItem() {
    if (this._shouldShowInitials()) {
      this.createInitialItem();
      return;
    }

    if (this.initialItem) {
      this.initialItem.dispose();
      this.initialItem = null;
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

  private _shouldShowInitials(): boolean {
    const config = workspace.getConfiguration('jetbrains-titlebar');
    return config.get<boolean>('showProjectInitials', true);
  }
}
