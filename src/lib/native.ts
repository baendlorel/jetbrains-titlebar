import { execSync } from 'node:child_process';
import vscode from 'vscode';

export const $info = vscode.window.showInformationMessage;
export const $err = vscode.window.showErrorMessage;
export const errorPop = (err: Error) => $err(err.message ?? err);

if (vscode.workspace.getConfiguration('jetbrains-titlebar').get('debug', false)) {
  $info('地址' + vscode.env.appRoot + ';appName=' + vscode.env.appName + ';appHost=' + vscode.env.appHost);
  const whichCode = execSync('which code').toString();
  const psCode = execSync('(Get-Command code).Source').toString();
  $info('shell which code: ' + whichCode + '; powershell which code: ' + psCode);
}
