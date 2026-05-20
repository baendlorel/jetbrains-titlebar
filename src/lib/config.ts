import { ConfigurationTarget, workspace } from 'vscode';

export const config = () => workspace.getConfiguration('jetbrains-titlebar');

export const loadCssPath = () => config().get<Record<string, string>>('cssPath', {});
export const saveCssPath = async (key: string, p: string) => {
  const cp = loadCssPath();
  cp[key] = p;
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
