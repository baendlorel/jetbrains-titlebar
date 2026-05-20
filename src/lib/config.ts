import { existsSync } from 'node:fs';
import { userInfo } from 'node:os';
import { ConfigurationTarget, workspace } from 'vscode';

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

export const pixel = (key: string, defaultValue: number, min: number = 0, max: number = Infinity): string => {
  const n = Math.floor(config().get<number>(key, defaultValue));
  const raw = Number.isSafeInteger(n) ? n : defaultValue;
  const clamped = Math.min(Math.max(raw, min), max);
  return `${clamped}px`;
};

export const percent = (key: string, defaultValue: number): string => {
  const n = Math.floor(config().get<number>(key, defaultValue));
  const raw = Number.isSafeInteger(n) ? n : defaultValue;
  return (Math.min(Math.max(raw, 0), 100) / 100).toString();
};
