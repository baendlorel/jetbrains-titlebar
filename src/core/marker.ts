import { StatusBarAlignment, StatusBarItem, window, workspace } from 'vscode';
import { getProjectInitials, hashIndex } from './utils.js';
import { Cfg } from '@/lib/config.js';
import { GLOW_COLORS, INITIAL_GLOW_COLORS } from '@/lib/colors.js';

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
    const colorIndex = this.getColorIndex();
    this.initialSbi.accessibilityInformation = {
      label: 'Project Initials' + colorIndex,
      role: String(this.colorIndexSkew(colorIndex)),
    };
  }

  update() {
    const colorIndex = this.getColorIndex();
    this.sbi.text = colorIndex.toString();

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

  colorIndexSkew(index: number): number {
    const s = Math.round(INITIAL_GLOW_COLORS.length / 3);
    return (index + s) % INITIAL_GLOW_COLORS.length;
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
