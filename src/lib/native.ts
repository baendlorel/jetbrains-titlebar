import { window } from 'vscode';

export const $info = window.showInformationMessage;
export const $err = window.showErrorMessage;
export const errorPop = (err: Error) => $err(err.message ?? err);
