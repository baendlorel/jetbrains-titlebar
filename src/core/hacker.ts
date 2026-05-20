import { window } from 'vscode';
import { appendFile, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { userInfo } from 'node:os';

import { Css, Intensity, Diameter, Offset } from '@/lib/consts.js';
import { t } from '@/lib/i18n.js';
import { $err, $info } from '@/lib/native.js';
import { COLORS } from '@/lib/colors.js';
import { loadCssPath, percent, pixel, saveCssPath } from '@/lib/config.js';

import { Marker } from './marker.js';
import { searchWorkbenchCss } from './utils.js';

// TODO 去掉事件侦听，让它一次注册，后续被垃圾回收

const key = ((u) => u.uid + '-' + u.gid + '-' + u.homedir)(userInfo());
const idSelector = Marker.instance.item.id.replaceAll('.', '\\.');

const tryGetCssPathAnd = async (fn?: (cssPath: string) => any): Promise<string | null> => {
  const p0 = loadCssPath()[key];
  if (p0 && existsSync(p0)) {
    await fn?.(p0);
    return p0;
  }

  const p1 = await autoRelocate();
  if (p1) {
    await fn?.(p1);
    return p1;
  }

  return null;
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

interface CssParts {
  before: string | null;
  after: string | null;
  content: string;
}

/**
 * Split the CSS file content into three parts: before the token, the injected part, and after the token.
 */
const readCss = async (cssPath: string): Promise<CssParts> => {
  const content = removeOldToken(await readFile(cssPath, 'utf8'));
  const result: CssParts = { before: null, after: null, content };

  const start = content.indexOf(Css.tokenStart);
  result.before = start === -1 ? null : content.slice(0, start);

  const end = content.indexOf(Css.tokenEnd, start);
  result.after = end === -1 ? null : content.slice(end);

  return result;
};

const inject = async (cssPath: string, forced = false): Promise<void> => {
  const oldCss = await readCss(cssPath);
  if (oldCss.before === null && oldCss.after === null) {
    await appendFile(cssPath, generateCss(), 'utf8');
    return;
  }

  // #if DEBUG
  $info(`When debugging, always inject`);
  // #else
  if (oldCss.before && !forced) {
    return; // injected already
  }
  // #endif

  await writeFile(cssPath, `${oldCss.before}${generateCss()}${oldCss.after}`, 'utf8');
  $info(t('hacker.input-path.success'));
};

const generateCss = () => {
  const base = Css.base
    .replace(/\n[\s]+/g, '')
    .replace('{{id}}', idSelector)
    .replace('{{intensity}}', percent('glowIntensity', Intensity.default))
    .replace('{{diameter}}', pixel('glowDiameter', Diameter.default, Diameter.min))
    .replace('{{offsetX}}', pixel('glowOffsetX', Offset.default, Offset.min));

  const t = Css.template.replace(/\n[\s]+/g, '').replace('{{id}}', idSelector);
  const styles = COLORS.map((c, i) => t.replaceAll('{{color}}', c).replaceAll('{{index}}', i.toString()));

  const acronym = Css.acronym
    .replace(/\n[\s]+/g, '')
    .replace('{{id}}', `${idSelector}\\.${Marker.instance.initialsItemId}`);

  return `\n${Css.tokenStart}${Css.tokenVersion}${base}${styles.join('')}${acronym}${Css.tokenEnd}\n`;
};

const clean = async (cssPath: string): Promise<void> => {
  const css = await readFile(cssPath, 'utf8');

  const start = css.indexOf(Css.tokenStart);
  if (start === -1) {
    $info(t('hacker.clean.no-need'));
    return;
  }

  const end = css.indexOf('\n', start);
  if (end === -1) {
    $info(t('hacker.clean.malformed'));
    return;
  }

  await writeFile(cssPath, css.slice(0, start) + css.slice(end), 'utf8');
  $info(t('hacker.clean.success'));
};

const removeOldToken = (css: string): string => {
  const start = css.indexOf(Css.tokenOld);
  if (start === -1) {
    return css;
  }

  let end = css.indexOf('\n', start);
  if (end === -1) {
    // Consider `end` to be the end of the file if there's no newline after the token
    end = css.length;
  }

  return css.slice(0, start) + Css.tokenStart + css.slice(start + Css.tokenOld.length, end) + Css.tokenEnd;
};

const apply = (): Promise<string | null> => tryGetCssPathAnd(inject);
const remove = (): Promise<string | null> => tryGetCssPathAnd(clean);

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
