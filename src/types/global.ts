import pkg from '../../package.json';
import pkgNls from '../../package.nls.json';

export type Fn = (...args: any[]) => any;

export type Pkg = typeof pkg;

// # Config Name
export type _ConfigKeys = keyof Pkg['contributes']['configuration']['properties'];
export type _StripPrefix<T> = T extends _ConfigKeys ? (T extends `jetbrains-titlebar.${infer R}` ? R : never) : never;

export type ConfigName = _StripPrefix<_ConfigKeys>;

// # Command Name
export type I18NKeys = keyof typeof pkgNls;
export type _StripPrefixAndTitle<T> = T extends I18NKeys ? (T extends `command.${infer R}.title` ? R : never) : never;

export type CommandName = _StripPrefixAndTitle<I18NKeys>;
