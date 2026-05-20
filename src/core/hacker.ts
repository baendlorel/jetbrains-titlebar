import { window } from 'vscode';
import { appendFile, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { userInfo } from 'node:os';

import { Css, Intensity, Diameter, Offset } from '@/lib/consts.js';
import { t } from '@/lib/i18n.js';
import { $err, $info } from '@/lib/native.js';
import { GLOW_COLORS } from '@/lib/colors.js';
import { loadCssPath, percent, pixel, saveCssPath } from '@/lib/config.js';

import { Marker } from './marker.js';
import { searchWorkbenchCss } from './utils.js';

// TODO 去掉事件侦听，让它一次注册，后续被垃圾回收

const key = ((u) => u.uid + '-' + u.gid + '-' + u.homedir)(userInfo());
const idSelector = Marker.instance.item.id.replaceAll('.', '\\.');

const tryGetCssPath = async (): Promise<string | null> => {
  const p = loadCssPath()[key];
  if (p && existsSync(p)) {
    return p;
  }
  return await autoRelocate();
};

/**
 * @returns `null` if user cancels or input is invalid, otherwise the valid path
 */
const promptForCssPath = async (prompt: string): Promise<string | null> => {
  const input = (await window.showInputBox({ prompt, ignoreFocusOut: true }))?.trim();
  if (!input) {
    return null;
  }

  if (existsSync(input)) {
    return input;
  }

  // TODO 这里的exist检查要更加精确提取，同时适配wsl和windows路径
  $err(t('file-not-found', input));
  return null;
};

const inject = async (cssPath: string): Promise<void> => {
  const oldCss = await readFile(cssPath, 'utf8');
  const rawStart = oldCss.indexOf(Css.token);
  if (rawStart === -1) {
    const css = generateCss();
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
  const css = generateCss();

  const newData = `${oldCss.slice(0, start)}${css}${oldCss.slice(end)}`;

  await writeFile(cssPath, newData, 'utf8');
  $info(t('hacker.input-path.success'));
};

const generateCss = () => {
  const intensity = percent('glowIntensity', Intensity.default);
  const diameter = pixel('glowDiameter', Diameter.default, Diameter.min);
  const offsetX = pixel('glowOffsetX', Offset.default, Offset.min);

  const base = Css.base
    .replace(/\n[\s]+/g, '')
    .replace('{{id}}', idSelector)
    .replace('{{intensity}}', intensity)
    .replace('{{diameter}}', diameter)
    .replace('{{offsetX}}', offsetX);
  const template = Css.template.replace(/\n[\s]+/g, '').replace('{{id}}', idSelector);

  const styles = GLOW_COLORS.map((color, index) =>
    template.replaceAll('{{color}}', color).replaceAll('{{index}}', String(index)),
  );

  const projectInitial = Css.projectInitial
    .replace(/\n[\s]+/g, '')
    .replace('{{id}}', `${idSelector}\\.${Marker.instance.initialsItemId}`);

  return `\n${Css.token}${Css.tokenVersion}${Css.tokenDate}${base}${styles.join('')}${projectInitial}\n`;
};

const clean = async (cssPath: string): Promise<void> => {
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
};

const apply = async () => {
  const cssPath = await tryGetCssPath();
  if (cssPath) {
    await inject(cssPath);
  }
};

const remove = async () => {
  const cssPath = await tryGetCssPath();
  if (cssPath) {
    await clean(cssPath);
  }
};

const manualRelocate = async (): Promise<void> => {
  const cssPath = await promptForCssPath(t('hacker.input-path.prompt'));
  if (!cssPath) {
    return;
  }
  await saveCssPath(key, cssPath);
  $info(t('hacker.relocate.success'));
};

const autoRelocate = async (): Promise<string | null> => {
  const autoPath = await searchWorkbenchCss();
  if (autoPath) {
    return await saveCssPath(key, autoPath);
  }

  const manualPath = await promptForCssPath(t('hacker.auto-relocate.fail'));
  if (manualPath) {
    return await saveCssPath(key, manualPath);
  }

  return null;
};
