import { ConfigurationTarget, window, workspace } from 'vscode';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';

import { i18n } from '@/lib/i18n.js';
import { searchWorkbenchCss, getCssColors, ConfigJustifier } from './utils.js';
import { homedir } from 'node:os';

// * /mnt/d/Programs/Microsoft VS Code/resources/app/out/vs/workbench/workbench.desktop.main.css
class Hacker {
  private readonly cssPathKey: string;
  constructor() {
    this.cssPathKey = homedir();
  }

  /**
   * Get saved CSS path from configuration
   */
  private getSavedPath(): string | null {
    const config = workspace.getConfiguration('jetbrains-titlebar');
    const map = config.get<Record<string, string>>('cssPath', {});

    const cachedPath = map[this.cssPathKey];
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
    cssPath[this.cssPathKey] = path;

    await config.update('cssPath', cssPath, ConfigurationTarget.Global);
  }

  private async getWorkbenchCssPath(): Promise<string | null> {
    // Try to use saved path first (unless force relocate)
    const p = this.getSavedPath();
    if (p) {
      return p;
    }

    return await this.relocateAuto(true);
  }

  private async manuallyInputCssPath(prompt?: string): Promise<string | null> {
    const input = await window.showInputBox({
      prompt: prompt ?? i18n['hacker.get-css-path.prompt'],
      ignoreFocusOut: true,
    });
    if (input === undefined) {
      return null;
    }
    const trimmed = input.trim();
    if (!existsSync(trimmed)) {
      window.showErrorMessage(i18n['hacker.get-css-path.not-found']);
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

    const colors = getCssColors();
    const styles = colors.map((color, index) =>
      template.replaceAll('{{color}}', color).replaceAll('{{index}}', String(index))
    );

    const lines = this.purge(oldCss.split('\n'));
    lines.push(`${Css.token}${Css.tokenVersion}${base}${styles.join('')}`);
    await writeFile(cssPath, lines.join('\n'), 'utf8');
    window.showInformationMessage(i18n['hacker.get-css-path.success']);
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

  async relocate(): Promise<void> {
    const cssPath = await this.manuallyInputCssPath();
    if (!cssPath) {
      return;
    }
    await this.savePath(cssPath);
    window.showInformationMessage(i18n['hacker.relocate.success']);
  }

  async relocateAuto(mute: boolean): Promise<string | null> {
    const autoPath = await searchWorkbenchCss();
    if (autoPath) {
      await this.savePath(autoPath);
      !mute && window.showInformationMessage(i18n['hacker.relocate.success']);
      return autoPath;
    }

    const manualPath = await this.manuallyInputCssPath(i18n['hacker.relocate-auto.fail']);
    if (manualPath) {
      await this.savePath(manualPath);
      !mute && window.showInformationMessage(i18n['hacker.relocate.success']);
      return manualPath;
    }

    window.showErrorMessage(i18n['hacker.relocate-auto.fail-again']);
    return null;
  }
}

export default new Hacker();
