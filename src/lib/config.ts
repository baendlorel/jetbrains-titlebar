import { ConfigurationTarget, workspace, WorkspaceConfiguration } from 'vscode';

export const getConfig = () => workspace.getConfiguration('jetbrains-titlebar');

export namespace Cfg {
  // # config part
  let cache: WorkspaceConfiguration = getConfig();
  export function refresh() {
    cache = getConfig();
  }
  export const get = <T>(section: string, defaultValue: T) => cache.get(section, defaultValue);
  export const update: (
    section: string,
    value: any,
    configurationTarget?: ConfigurationTarget | boolean | null,
    overrideInLanguage?: boolean,
  ) => Promise<void> = async (section, value, configurationTarget, overrideInLanguage) => {
    await cache.update(section, value, configurationTarget, overrideInLanguage);
    cache = getConfig();
  };

  // # transformers
  export function pixel(key: string, defaultValue: number, min: number = 0, max: number = Infinity): string {
    const n = Math.floor(Cfg.get<number>(key, defaultValue));
    const raw = Number.isSafeInteger(n) ? n : defaultValue;
    const clamped = Math.min(Math.max(raw, min), max);
    return `${clamped}px`;
  }

  export function percent(key: string, defaultValue: number): string {
    const n = Math.floor(Cfg.get<number>(key, defaultValue));
    const raw = Number.isSafeInteger(n) ? n : defaultValue;
    const clamped = Math.min(Math.max(raw, 0), 100) / 100;
    return clamped.toString();
  }
}
