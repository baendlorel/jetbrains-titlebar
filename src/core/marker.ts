import { StatusBarAlignment, StatusBarItem, window, workspace } from 'vscode';
import { getProjectInitials, hashIndex } from './utils.js';

export class Marker {
  static readonly instance = new Marker();

  readonly item: StatusBarItem;
  private _projectInitials = '';
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
    this.item.text = this._getColorIndex().toString();
    this._projectInitials = this._getProjectInitials();
  }

  get projectInitials(): string {
    return this._projectInitials;
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
