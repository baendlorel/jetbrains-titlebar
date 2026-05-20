import { ConfigurationTarget, workspace } from 'vscode';
import { existsSync } from 'node:fs';
import { userInfo } from 'node:os';
import { clamp, safeInt } from '@/core/utils';

const uniqueKey = ((u) => u.uid + '-' + u.gid + '-' + u.homedir)(userInfo());
export const config = () => workspace.getConfiguration('jetbrains-titlebar');

export const loadCssPath = (): string | null => {
  const p = config().get<Record<string, string>>('cssPath', {})[uniqueKey];
  return p && existsSync(p) ? p : null;
};

export const saveCssPath = async (p: string) => {
  const cp = config().get<Record<string, string>>('cssPath', {});
  cp[uniqueKey] = p;
  await config().update('cssPath', cp, ConfigurationTarget.Global);
  return p;
};

export const pixel = (key: string, defaultValue: number, min: number = 0, max: number = Infinity): string =>
  `${clamp(safeInt(config().get(key, defaultValue), defaultValue), min, max)}px`;

export const percent = (key: string, defaultValue: number): string =>
  (clamp(safeInt(config().get(key, defaultValue), defaultValue), 0, 100) / 100).toString();

export const projectName = (): string => {
  const workspaceFolders = workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    return '';
  }
  return workspaceFolders[0].name.trim();
};
