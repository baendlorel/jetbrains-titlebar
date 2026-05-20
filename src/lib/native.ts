import isWsl from 'is-wsl';
import { execSync } from 'node:child_process';
import path from 'node:path';
import vscode from 'vscode';

export const $info = vscode.window.showInformationMessage;
export const $err = vscode.window.showErrorMessage;
export const errorPop = (err: Error) => $err(err.message ?? err);

if (vscode.workspace.getConfiguration('jetbrains-titlebar').get('debug', false)) {
  // $info('地址' + vscode.env.appRoot + ';appName=' + vscode.env.appName + ';appHost=' + vscode.env.appHost);

  // $info('isWsl = ' + isWsl);
  // let whichCode = 'maybe error';
  // try {
  //   whichCode = execSync('which code').toString();
  // } catch {}
  // let psCode = 'maybe error';
  // try {
  //   psCode = execSync('(Get-Command code).Source').toString();
  // } catch {}

  // $info('which code: ' + whichCode + '; powershell which code: ' + psCode);
  //out\vs\workbench
  const p = path.join(vscode.env.appRoot, 'out', 'vs', 'workbench', 'workbench.desktop.main.css');
  $info('css path: ' + p);
  vscode.workspace.fs.stat(vscode.Uri.file(p)).then(
    () => $info('css exists: yes!'),
    () => $info('css exists: NO!!!!'),
  );
}
