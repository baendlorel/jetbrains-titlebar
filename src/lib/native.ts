import vscode from 'vscode';

export const $info = vscode.window.showInformationMessage;
export const $err = vscode.window.showErrorMessage;
export const errorPop = (err: Error) => $err(err.message ?? err);

if (vscode.workspace.getConfiguration('jetbrains-titlebar').get('debug', false)) {
  $info('地址' + vscode.env.appRoot + ';appName=' + vscode.env.appName + ';appHost=' + vscode.env.appHost);
}
