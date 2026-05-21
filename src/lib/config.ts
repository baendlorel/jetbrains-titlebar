import vscode from 'vscode';
import { existsSync } from 'node:fs';

import { clamp, safeInt } from '@/core/utils.js';
import { $info } from './native.js';
import { t } from './l10n.js';

const uniqueKey = vscode.env.machineId;
export const config = () => vscode.workspace.getConfiguration('jetbrains-titlebar');

export const loadCssPath = (): string | null => {
  const p = config().get<Record<string, string>>('cssPath', {})[uniqueKey];
  if (p && existsSync(p)) {
    return p;
  } else {
    $info(t('config.outdated-css-path', p));
    return null;
  }
};

export const saveCssPath = async (p: string) => {
  const cp = config().get<Record<string, string>>('cssPath', {});
  cp[uniqueKey] = p;
  $info(t('config.save-css-path', p));
  await config().update('cssPath', cp, vscode.ConfigurationTarget.Global);
  return p;
};

export const pixel = (key: string, defaultValue: number, min: number = 0, max: number = Infinity): string =>
  `${clamp(safeInt(config().get(key, defaultValue), defaultValue), min, max)}px`;

export const percent = (key: string, defaultValue: number): string =>
  (clamp(safeInt(config().get(key, defaultValue), defaultValue), 0, 100) / 100).toString();

export const projectName = (): string => {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    return '';
  }
  return workspaceFolders[0].name.trim();
};
