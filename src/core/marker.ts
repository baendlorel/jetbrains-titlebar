import { StatusBarAlignment, StatusBarItem, window, workspace } from 'vscode';
import { getProjectInitials, hashIndex } from './utils.js';
import { Cfg } from '@/lib/config.js';

class Marker {
  readonly INITIALS_SBI_ID = 'project-initials';
  readonly sbi: StatusBarItem;
  initialSbi: StatusBarItem | null = null;

  constructor() {
    this.sbi = window.createStatusBarItem(StatusBarAlignment.Left, -Infinity);
    this.update();

    // #if DEBUG
    this.sbi.color = 'red';
    // #else
    this.sbi.color = 'transparent';
    // #endif

    this.sbi.show();

    this.syncInitialItem();
  }

  get sbiId() {
    return this.sbi.id;
  }

  createInitialItem() {
    if (this.initialSbi) {
      return;
    }
    this.initialSbi = window.createStatusBarItem(this.INITIALS_SBI_ID, StatusBarAlignment.Left, -Infinity);
    this.initialSbi.color = '#f7f8faaf';
    this.initialSbi.show();
  }

  update() {
    this.sbi.text = this.getColorIndex().toString();

    this.syncInitialItem();
    if (this.initialSbi) {
      this.initialSbi.text = this.getProjectInitials();
    }
  }

  syncInitialItem() {
    if (Cfg.get<boolean>('showProjectInitials', true)) {
      this.createInitialItem();
      return;
    }

    if (this.initialSbi) {
      this.initialSbi.dispose();
      this.initialSbi = null;
    }
  }

  private getColorIndex(): number {
    const workspaceFolders = workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      return 0;
    }

    const folderName = workspaceFolders[0].name;

    // Mix in color seed if configured
    const colorSeed = Cfg.get<string>('colorSeed', '');
    const mixedName = colorSeed ? `${folderName}::${colorSeed}` : folderName;

    return hashIndex(mixedName);
  }

  private getProjectInitials(): string {
    const workspaceFolders = workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      return '';
    }
    return getProjectInitials(workspaceFolders[0].name);
  }
}

export const marker = new Marker();
