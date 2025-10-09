import { StatusBarAlignment, StatusBarItem, window } from 'vscode';
import { getColorIndexFromWorkspace } from './utils.js';

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
    const colorIndex = getColorIndexFromWorkspace();
    this.item.text = `KS${colorIndex}`;
  }
}
