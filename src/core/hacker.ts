import { ConfigurationTarget, window } from 'vscode';
import { appendFile, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { userInfo } from 'node:os';

import { i18n } from '@/lib/i18n.js';
import { $err, $info } from '@/lib/native.js';
import { GLOW_COLORS } from '@/lib/colors.js';
import { Cfg } from '@/lib/config.js';
import { marker } from './marker.js';
import { searchWorkbenchCss } from './utils.js';

class Hacker {
  private readonly cssPathKey: string;
  private readonly markerIdSelector: string;
  constructor() {
    const u = userInfo();
    this.cssPathKey = u.uid + '-' + u.gid + '-' + u.homedir;
    this.markerIdSelector = marker.sbiId.replaceAll('.', '\\.');
  }

  /**
   * Get saved CSS path from configuration
   */
  private getSavedPath(): string | null {
    const map = Cfg.get<Record<string, string>>('cssPath', {});

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
    const cssPath = Cfg.get<Record<string, string>>('cssPath', {});
    cssPath[this.cssPathKey] = path;

    await Cfg.update('cssPath', cssPath, ConfigurationTarget.Global);
  }

  private async getWorkbenchCssPath(): Promise<string | null> {
    // Try to use saved path first (unless force relocate)
    const p = this.getSavedPath();
    if (p) {
      return p;
    }

    return await this.autoReloc(true);
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
      $err(i18n['file-not-found'].replace('$0', trimmed));
      return null;
    }
    return trimmed;
  }

  private async inject(cssPath: string): Promise<void> {
    const oldCss = await readFile(cssPath, 'utf8');

    const rawStart = oldCss.indexOf(Css.token);
    if (rawStart === -1) {
      const css = this.generateCss();
      await appendFile(cssPath, css, 'utf8');
      return;
    }

    // #if DEBUG
    $info(`When debugging, always inject`);
    // #else
    if (oldCss.includes(Css.tokenVersion, rawStart)) {
      return; // injected already
    }
    // #endif

    const eolIndex = oldCss.indexOf('\n', rawStart);
    const end = eolIndex === -1 ? oldCss.length : eolIndex;
    const start = oldCss[rawStart - 1] === '\n' ? rawStart - 1 : rawStart;
    const css = this.generateCss();

    const newData = `${oldCss.slice(0, start)}${css}${oldCss.slice(end)}`;

    await writeFile(cssPath, newData, 'utf8');
    $info(i18n['hacker.input-path.success']);
  }

  /**
   * Generate css for injection, with `\n`
   */
  private generateCss() {
    const base = Css.base
      .replace(/\n[\s]+/g, '')
      .replace('{{intensity}}', Cfg.percent('glowIntensity', Intensity.default))
      .replace('{{diameter}}', Cfg.pixel('glowDiameter', Diameter.default, Diameter.min))
      .replace('{{offsetX}}', Cfg.pixel('glowOffsetX', Offset.default, Offset.min));
    const template = Css.template.replace(/\n[\s]+/g, '');

    const styles = GLOW_COLORS.map((color, index) =>
      template.replaceAll('{{color}}', color).replaceAll('{{index}}', String(index)),
    ).join('');

    const projectInitial = Css.projectInitial.replace(/\n[\s]+/g, '');
    const projectInitialBgColor = GLOW_COLORS.map((color, index) =>
      Css.projectInitialBgColor.replaceAll('{{color}}', color).replaceAll('{{index}}', String(index)),
    ).join('');

    return `\n${Css.token}${Css.tokenVersion}${Css.tokenDate}${base}${styles}${projectInitial}${projectInitialBgColor}\n`;
  }

  /**
   * Remove injected gradient styles from the CSS file
   * @param cssPath Path to the workbench CSS file
   */
  private async clean(cssPath: string): Promise<void> {
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

  // Same sense of malloc
  async manualReloc(): Promise<void> {
    const cssPath = await this.inputCssPath();
    if (!cssPath) {
      return;
    }
    await this.savePath(cssPath);
    $info(i18n['hacker.relocate.success']);
  }

  async autoReloc(mute: boolean): Promise<string | null> {
    const autoPath = await searchWorkbenchCss();
    if (autoPath) {
      await this.savePath(autoPath);
      if (!mute) {
        $info(i18n['hacker.relocate.success']);
      }
      return autoPath;
    }

    const manualPath = await this.inputCssPath(i18n['hacker.auto-relocate.fail']);
    if (manualPath) {
      await this.savePath(manualPath);
      if (!mute) {
        $info(i18n['hacker.relocate.success']);
      }
      return manualPath;
    }
    return null;
  }
}

export const hacker = new Hacker();
