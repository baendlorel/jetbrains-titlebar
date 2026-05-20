import vscode from 'vscode';

export const $info = vscode.window.showInformationMessage;
export const $err = vscode.window.showErrorMessage;
export const errorPop = (err: Error) => $err(err.message ?? err);
