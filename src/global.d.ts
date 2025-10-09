import pkg from '../package.json';
import pkgNls from '../package.nls.json';

declare global {
  const __IS_DEV__: boolean;

  namespace logger {
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

  type Pkg = typeof pkg;

  // # Config Name
  type _ConfigKeys = keyof Pkg['contributes']['configuration']['properties'];
  type _StripPrefix<T> = T extends _ConfigKeys
    ? T extends `jetbrains-titlebar.${infer R}`
      ? R
      : never
    : never;

  type ConfigName = _StripPrefix<_ConfigKeys>;

  // # Command Name
  type I18NKeys = keyof typeof pkgNls;
  type _StripPrefixAndTitle<T> = T extends I18NKeys
    ? T extends `command.${infer R}.title`
      ? R
      : never
    : never;

  type CommandName = _StripPrefixAndTitle<I18NKeys>;
}
