import { StatusBarAlignment, StatusBarItem, window } from 'vscode';
import { getColorIndexFromWorkspace } from './utils.js';

export class Marker {
  readonly item: StatusBarItem;
  constructor() {
    this.item = window.createStatusBarItem(StatusBarAlignment.Left, NaN);
    this.item.text = 'Ready';
    this.item.color = 'red'; // 'transparent';
    this.item.show();
  }

  update() {
    const colorIndex = getColorIndexFromWorkspace();
    this.item.text = `KS${colorIndex}`;
  }
}
