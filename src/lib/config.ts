import { workspace, WorkspaceConfiguration } from 'vscode';

export class ConfigJustifier {
  private readonly _config: WorkspaceConfiguration;
  constructor() {
    this._config = workspace.getConfiguration('jetbrains-titlebar');
  }

  pixel(key: string, defaultValue: number, min: number = 0, max: number = Infinity): string {
    const n = Math.floor(this._config.get<number>(key, defaultValue));
    const raw = Number.isSafeInteger(n) ? n : defaultValue;
    const clamped = Math.min(Math.max(raw, min), max);
    return `${clamped}px`;
  }

  percent(key: string, defaultValue: number): string {
    const n = Math.floor(this._config.get<number>(key, defaultValue));
    const raw = Number.isSafeInteger(n) ? n : defaultValue;
    const clamped = Math.min(Math.max(raw, 0), 100) / 100;
    return clamped.toString();
  }
}
