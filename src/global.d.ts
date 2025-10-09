/**
 * 是否为开发环境
 * - 在正式环境中不会有这个值
 */
declare const __IS_DEV__: boolean;

declare namespace logger {
  function info(...message: any[]): void;
  function warn(...message: any[]): void;
  function error(...message: any[]): void;
  function debug(...message: any[]): void;
  function succ(...message: any[]): void;
  function verbose(...message: any[]): void;
  function WorkspaceNotFound(id: string): void;
  function TabNotFoundInWorkspace(id: string, tabId: number): void;
}

type Fn = (...args: any[]) => any;

type Pkg = typeof import('../package.json');

// # Config Name
type _ConfigKeys = keyof Pkg['contributes']['configuration']['properties'];
type _StripPrefix<T> = T extends _ConfigKeys
  ? T extends `jetbrains-titlebar.${infer R}`
    ? R
    : never
  : never;

type ConfigName = _StripPrefix<_ConfigKeys>;

// # Command Name
type I18NKeys = keyof typeof import('../package.nls.json');
type _StripPrefixAndTitle<T> = T extends I18NKeys
  ? T extends `command.${infer R}.title`
    ? R
    : never
  : never;

type CommandName = _StripPrefixAndTitle<I18NKeys>;
