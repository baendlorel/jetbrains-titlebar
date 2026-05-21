import vscode from 'vscode';
import { inspect } from 'node:util';
import type { I18NKeys } from '@/types/global.js';

export const $info = vscode.window.showInformationMessage;
export const $err = vscode.window.showErrorMessage;
export const errorPop = (err: Error) => $err(inspect(err));
export const t = ((...args) => vscode.l10n.t(...args)) as (key: I18NKeys, ...args: string[]) => string;
