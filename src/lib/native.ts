import vscode from 'vscode';
import { inspect } from 'node:util';

export const $info = vscode.window.showInformationMessage;
export const $err = vscode.window.showErrorMessage;
export const errorPop = (err: Error) => $err(inspect(err));
