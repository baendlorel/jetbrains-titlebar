import pkg from '../package.json';
import pkgNls from '../package.nls.json';

declare global {
  type Pkg = typeof pkg;

  // # Config Name
  type _ConfigKeys = keyof Pkg['contributes']['configuration']['properties'];
  type _StripPrefix<T> = T extends _ConfigKeys ? (T extends `jetbrains-titlebar.${infer R}` ? R : never) : never;

  type ConfigName = _StripPrefix<_ConfigKeys>;

  // # Command Name
  type I18NKeys = keyof typeof pkgNls;
  type _StripPrefixAndTitle<T> = T extends I18NKeys ? (T extends `command.${infer R}.title` ? R : never) : never;

  type CommandName = _StripPrefixAndTitle<I18NKeys>;
}
