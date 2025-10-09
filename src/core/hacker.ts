import { ConfigurationTarget, window, workspace } from 'vscode';
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { userInfo } from 'node:os';

import { i18n } from '@/lib/i18n.js';
import { $err, $info } from '@/lib/native.js';
import { GLOW_COLORS } from '@/lib/colors.js';
import { ConfigJustifier } from '@/lib/config.js';
import { searchWorkbenchCss } from './utils.js';

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
  private _getSavedPath(): string | null {
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
  private async _savePath(path: string): Promise<void> {
    const config = workspace.getConfiguration('jetbrains-titlebar');
    const cssPath = config.get<Record<string, string>>('cssPath', {});
    cssPath[this._key] = path;

    await config.update('cssPath', cssPath, ConfigurationTarget.Global);
  }

  private async _getWorkbenchCssPath(): Promise<string | null> {
    // Try to use saved path first (unless force relocate)
    const p = this._getSavedPath();
    if (p) {
      return p;
    }

    return await this.autoReloc(true);
  }

  /**
   * Only get the input, will not save
   */
  private async _inputCssPath(prompt?: string): Promise<string | null> {
    const input = await window.showInputBox({
      prompt: prompt ?? i18n['hacker.input-path.prompt'],
      ignoreFocusOut: true,
    });
    if (input === undefined) {
      return null;
    }
    const trimmed = input.trim();
    if (!existsSync(trimmed)) {
      $err(i18n['file-not-found'].replace('$0', trimmed));
      return null;
    }
    return trimmed;
  }

  private async _inject(cssPath: string): Promise<void> {
    const oldCss = await readFile(cssPath, 'utf8');

    const start = oldCss.indexOf(Css.token);

    // #if DEBUG
    $info('When debugging, always inject');
    // #else
    if (start !== -1 && oldCss.includes(Css.tokenVersion, start)) {
      return; // injected already
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

    const eolIndex = oldCss.indexOf('\n', start) + 1;
    const end = eolIndex === -1 ? oldCss.length : eolIndex;

    const newLine = `${Css.token}${Css.tokenVersion}${base}${styles.join('')}`;
    const newData = `${oldCss.slice(0, start)}${newLine}\n${oldCss.slice(end)}`;
    await writeFile(cssPath, newData, 'utf8');
    $info(i18n['hacker.input-path.success']);
  }

  /**
   * Remove injected gradient styles from the CSS file
   * @param cssPath Path to the workbench CSS file
   */
  private async _clean(cssPath: string): Promise<void> {
    const css = await readFile(cssPath, 'utf8');

    const start = css.indexOf(Css.token);
    if (start === -1) {
      $info(i18n['hacker.clean.no-need']);
      return;
    }

    const end = css.indexOf('\n', start);
    if (end === -1) {
      $info(i18n['hacker.clean.malformed']);
      return;
    }

    const cleaned = css.slice(0, start) + css.slice(end);
    await writeFile(cssPath, cleaned, 'utf8');
    $info(i18n['hacker.clean.success']);
  }

  async apply(): Promise<void> {
    const cssPath = await this._getWorkbenchCssPath();
    if (cssPath) {
      await this._inject(cssPath);
    }
  }

  async remove() {
    const cssPath = await this._getWorkbenchCssPath();
    if (cssPath) {
      await this._clean(cssPath);
    }
  }

  // Same sense of malloc
  async manualReloc(): Promise<void> {
    const cssPath = await this._inputCssPath();
    if (!cssPath) {
      return;
    }
    await this._savePath(cssPath);
    $info(i18n['hacker.relocate.success']);
  }

  async autoReloc(mute: boolean): Promise<string | null> {
    const autoPath = await searchWorkbenchCss();
    if (autoPath) {
      await this._savePath(autoPath);
      if (!mute) {
        $info(i18n['hacker.relocate.success']);
      }
      return autoPath;
    }

    const manualPath = await this._inputCssPath(i18n['hacker.auto-relocate.fail']);
    if (manualPath) {
      await this._savePath(manualPath);
      if (!mute) {
        $info(i18n['hacker.relocate.success']);
      }
      return manualPath;
    }
    return null;
  }
}
