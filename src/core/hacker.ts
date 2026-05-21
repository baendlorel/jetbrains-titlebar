import { window } from 'vscode';
import { appendFile, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

import { Css, Intensity, Diameter, Offset } from '@/lib/consts.js';
import { t } from '@/lib/l10n.js';
import { $err, $info } from '@/lib/native.js';
import { COLORS } from '@/lib/colors.js';
import { loadCssPath, percent, pixel, saveCssPath } from '@/lib/config.js';

import { nullReturn } from './utils.js';
import { searchCssPath } from './search-css.js';

/**
 * @returns `null` if user cancels or input is invalid, otherwise the valid path
 */
const promptForCssPath = async (prompt: string = t('hacker.input-path.prompt')): Promise<string | null> => {
  const input = (await window.showInputBox({ prompt, ignoreFocusOut: true }))?.trim();
  if (!input) {
    return null;
  }

  if (existsSync(input)) {
    return input;
  }

  $err(t('file-not-found', input));
  return null;
};

interface CssParts {
  before: string | null;
  after: string | null;
  content: string;
  version: string | null;
}

/**
 * Split the CSS file content into three parts: before the token, the injected part, and after the token.
 */
const read = async (cssPath: string): Promise<CssParts> => {
  const content = removeOldToken(await readFile(cssPath, 'utf8'));
  const result: CssParts = { before: null, after: null, content, version: null };

  const start = content.indexOf(Css.tokenStart);
  if (start === -1) {
    return result;
  }

  result.before = content.slice(0, start);

  const end = content.indexOf(Css.tokenEnd, start);
  if (end === -1) {
    return result;
  }

  result.after = content.slice(end + Css.tokenEnd.length);

  const innerStart = start + Css.tokenStart.length;
  const version = content.slice(innerStart, end).match(/^\/\*([\d.]+)\*\//)?.[1];
  result.version = version ?? null;

  return result;
};

const replaceColorAndIndex = (text: string, color: string, index: number) =>
  text.replaceAll('{{color}}', color).replaceAll('{{index}}', `${index}`);

const generate = () => {
  const base = Css.base
    .replace(/\n[\s]+/g, '')
    .replace('{{intensity}}', percent('glowIntensity', Intensity.default))
    .replace('{{diameter}}', pixel('glowDiameter', Diameter.default, Diameter.min))
    .replace('{{offsetX}}', pixel('glowOffsetX', Offset.default, Offset.min));

  const styles = COLORS.map((c, i) => replaceColorAndIndex(Css.template, c, i)).join(''); // 32, jetbrains-titlebar
  const abbrBg = COLORS.map((c, i) => replaceColorAndIndex(Css.abbrBg, c, i)).join('');

  return `${Css.tokenStart}${Css.tokenVersion}${base}${styles}${Css.abbr}${abbrBg}${Css.tokenEnd}`;
};

const inject = async (cssPath: string): Promise<void> => {
  const oldCss = await read(cssPath);
  if (oldCss.before === null && oldCss.after === null) {
    await appendFile(cssPath, generate(), 'utf8');
    return;
  }

  if (__IS_DEV__) {
    $info(`When debugging, always inject. Old version: ${oldCss.version}, new version: __VERSION__`);
  }

  if (oldCss.version === '__VERSION__') {
    if (!__IS_DEV__) {
      return;
    }
  } else {
    $info(t('hacker.re-inject-for-new-version'));
  }

  await writeFile(cssPath, `${oldCss.before}${generate()}${oldCss.after}`, 'utf8');
  $info(t('hacker.input-path.success'));
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

export const relocate = nullReturn([searchCssPath, promptForCssPath], [saveCssPath]);
export const apply = nullReturn([loadCssPath, relocate], [inject]);
export const remove = nullReturn([loadCssPath, relocate], [clean]);
export const manualRelocate = nullReturn([promptForCssPath], [saveCssPath, () => $info(t('hacker.relocate.success'))]);
