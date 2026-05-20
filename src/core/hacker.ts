import { ConfigurationTarget, window, workspace } from 'vscode';
import { appendFile, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { userInfo } from 'node:os';

import { Css, Intensity, Diameter, Offset } from '@/lib/consts.js';
import { t } from '@/lib/i18n.js';
import { $err, $info } from '@/lib/native.js';
import { GLOW_COLORS } from '@/lib/colors.js';
import { ConfigJustifier, cssPath, saveCssPath } from '@/lib/config.js';
import { Marker } from './marker.js';
import { searchWorkbenchCss } from './utils.js';

// TODO 重构为更清晰的版本，这个class的其实也不太好。
// TODO 去掉事件侦听，让它一次注册，后续被垃圾回收

const u = userInfo();
const key = u.uid + '-' + u.gid + '-' + u.homedir;
const idSelector = Marker.instance.item.id.replaceAll('.', '\\.');

const getWorkbenchCssPath = async (): Promise<string | null> => {
  const p = cssPath()[key];
  if (p && existsSync(p)) {
    return p;
  }
  return await autoReloc(true);
};

const savePath = saveCssPath;

const inputCssPath = async (prompt?: string): Promise<string | null> => {
  const input = await window.showInputBox({
    prompt: prompt ?? t('hacker.input-path.prompt'),
    ignoreFocusOut: true,
  });
  if (input === undefined) {
    return null;
  }
  const trimmed = input.trim();
  if (!existsSync(trimmed)) {
    // TODO 这里的exist检查要更加精确提取，同时适配wsl和windows路径
    $err(t('file-not-found', trimmed));
    return null;
  }
  return trimmed;
};

export class Hacker {
  private async _inject(cssPath: string): Promise<void> {
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
    $info(t('hacker.input-path.success'));
  }

  /**
   * Generate css for injection, with `\n`
   */
  private generateCss() {
    const justifier = new ConfigJustifier();
    const intensity = justifier.percent('glowIntensity', Intensity.default);
    const diameter = justifier.pixel('glowDiameter', Diameter.default, Diameter.min);
    const offsetX = justifier.pixel('glowOffsetX', Offset.default, Offset.min);

    const base = Css.base
      .replace(/\n[\s]+/g, '')
      .replace('{{id}}', this._idSelector)
      .replace('{{intensity}}', intensity)
      .replace('{{diameter}}', diameter)
      .replace('{{offsetX}}', offsetX);
    const template = Css.template.replace(/\n[\s]+/g, '').replace('{{id}}', this._idSelector);

    const styles = GLOW_COLORS.map((color, index) =>
      template.replaceAll('{{color}}', color).replaceAll('{{index}}', String(index)),
    );

    const projectInitial = Css.projectInitial
      .replace(/\n[\s]+/g, '')
      .replace('{{id}}', `${this._idSelector}\\.${Marker.instance.initialsItemId}`);

    return `\n${Css.token}${Css.tokenVersion}${Css.tokenDate}${base}${styles.join('')}${projectInitial}\n`;
  }

  /**
   * Remove injected gradient styles from the CSS file
   * @param cssPath Path to the workbench CSS file
   */
  private async _clean(cssPath: string): Promise<void> {
    const css = await readFile(cssPath, 'utf8');

    const start = css.indexOf(Css.token);
    if (start === -1) {
      $info(t('hacker.clean.no-need'));
      return;
    }

    const end = css.indexOf('\n', start);
    if (end === -1) {
      $info(t('hacker.clean.malformed'));
      return;
    }

    const cleaned = css.slice(0, start) + css.slice(end);
    await writeFile(cssPath, cleaned, 'utf8');
    $info(t('hacker.clean.success'));
  }

  async apply(): Promise<void> {
    const cssPath = await getWorkbenchCssPath();
    if (cssPath) {
      await this._inject(cssPath);
    }
  }

  async remove() {
    const cssPath = await getWorkbenchCssPath();
    if (cssPath) {
      await this._clean(cssPath);
    }
  }

  // Same sense of malloc
  async manualReloc(): Promise<void> {
    const cssPath = await inputCssPath();
    if (!cssPath) {
      return;
    }
    await savePath(cssPath);
    $info(t('hacker.relocate.success'));
  }

  async autoReloc(mute: boolean): Promise<string | null> {
    const autoPath = await searchWorkbenchCss();
    if (autoPath) {
      await savePath(autoPath);
      if (!mute) {
        $info(t('hacker.relocate.success'));
      }
      return autoPath;
    }

    const manualPath = await this._inputCssPath(t('hacker.auto-relocate.fail'));
    if (manualPath) {
      await savePath(manualPath);
      if (!mute) {
        $info(t('hacker.relocate.success'));
      }
      return manualPath;
    }
    return null;
  }
}
