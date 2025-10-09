import { ConfigurationTarget, window, workspace } from 'vscode';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { userInfo } from 'node:os';

import { i18n } from '@/lib/i18n.js';
import { searchWorkbenchCss, ConfigJustifier } from './utils.js';
import { GLOW_COLORS } from '@/lib/colors.js';

export class Hacker {
  static getInstance() {
    return Hacker._instance;
  }

  private static readonly _instance = new Hacker();
  private readonly _key: string;

  constructor() {
    const u = userInfo();
    this._key = u.uid + '-' + u.gid + '-' + u.homedir;
  }

  /**
   * Get saved CSS path from configuration
   */
  private getSavedPath(): string | null {
    const config = workspace.getConfiguration('jetbrains-titlebar');
    const map = config.get<Record<string, string>>('cssPath', {});

    const cachedPath = map[this._key];
    if (cachedPath && existsSync(cachedPath)) {
      return cachedPath;
    }
    return null;
  }

  /**
   * Save CSS path to configuration
   */
  private async savePath(path: string): Promise<void> {
    const config = workspace.getConfiguration('jetbrains-titlebar');
    const cssPath = config.get<Record<string, string>>('cssPath', {});
    cssPath[this._key] = path;

    await config.update('cssPath', cssPath, ConfigurationTarget.Global);
  }

  private async getWorkbenchCssPath(): Promise<string | null> {
    // Try to use saved path first (unless force relocate)
    const p = this.getSavedPath();
    if (p) {
      return p;
    }

    return await this.autoRelocate(true);
  }

  /**
   * Only get the input, will not save
   */
  private async inputCssPath(prompt?: string): Promise<string | null> {
    const input = await window.showInputBox({
      prompt: prompt ?? i18n['hacker.input-path.prompt'],
      ignoreFocusOut: true,
    });
    if (input === undefined) {
      return null;
    }
    const trimmed = input.trim();
    if (!existsSync(trimmed)) {
      window.showErrorMessage(i18n['file-not-found'].replace('$0', trimmed));
      return null;
    }
    return trimmed;
  }

  /**
   * Remove lines containing the CSS token from the array
   * @param lines Array of CSS lines
   * @returns Filtered array without injected lines
   */
  private purge(lines: string[]): string[] {
    return lines.filter((line) => !line.trim().startsWith(Css.token));
  }

  /**
   * Inject gradient CSS styles into the workbench CSS file
   */
  private async inject(cssPath: string): Promise<void> {
    const oldCss = await readFile(cssPath, 'utf8');

    // ?? 可以只看几行？
    const injected = oldCss.includes(Css.token) && oldCss.includes(Css.tokenVersion);

    // #if DEBUG
    window.showInformationMessage('When debugging, always inject');
    // #else
    if (injected) {
      return;
    }
    // #endif

    const justifier = new ConfigJustifier();
    const intensity = justifier.percent('glowIntensity', Intensity.default);
    const diameter = justifier.pixel('glowDiameter', Diameter.default, Diameter.min);
    const offsetX = justifier.pixel('glowOffsetX', Offset.default, Offset.min);

    const base = Css.base
      .replace(/\n[\s]+/g, '')
      .replace('{{intensity}}', intensity)
      .replace('{{diameter}}', diameter)
      .replace('{{offsetX}}', offsetX);
    const template = Css.template.replace(/\n[\s]+/g, '');

    const styles = GLOW_COLORS.map((color, index) =>
      template.replaceAll('{{color}}', color).replaceAll('{{index}}', String(index))
    );

    const lines = this.purge(oldCss.split('\n'));
    lines.push(`${Css.token}${Css.tokenVersion}${base}${styles.join('')}`);
    await writeFile(cssPath, lines.join('\n'), 'utf8');
    window.showInformationMessage(i18n['hacker.input-path.success']);
  }

  /**
   * Remove injected gradient styles from the CSS file
   * @param cssPath Path to the workbench CSS file
   */
  private async clean(cssPath: string): Promise<void> {
    const css = await readFile(cssPath, 'utf8');
    const lines = this.purge(css.split('\n'));
    await writeFile(cssPath, lines.join('\n'), 'utf8');
    window.showInformationMessage(i18n['hacker.clean.success']);
  }

  async apply(): Promise<void> {
    const cssPath = await this.getWorkbenchCssPath();
    if (cssPath) {
      await this.inject(cssPath);
    }
  }

  async remove() {
    const cssPath = await this.getWorkbenchCssPath();
    if (cssPath) {
      await this.clean(cssPath);
    }
  }

  async manuallyRelocate(): Promise<void> {
    const cssPath = await this.inputCssPath();
    if (!cssPath) {
      return;
    }
    await this.savePath(cssPath);
    window.showInformationMessage(i18n['hacker.relocate.success']);
  }

  async autoRelocate(mute: boolean): Promise<string | null> {
    const autoPath = await searchWorkbenchCss();
    if (autoPath) {
      await this.savePath(autoPath);
      !mute && window.showInformationMessage(i18n['hacker.relocate.success']);
      return autoPath;
    }

    const manualPath = await this.inputCssPath(i18n['hacker.auto-relocate.fail']);
    if (manualPath) {
      await this.savePath(manualPath);
      !mute && window.showInformationMessage(i18n['hacker.relocate.success']);
      return manualPath;
    }
    return null;
  }
}
