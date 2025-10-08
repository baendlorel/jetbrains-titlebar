import vscode from 'vscode';
import hacker from '@/core/hacker.js';

export default (context: vscode.ExtensionContext) => {
  const commands: vscode.Disposable[] = [
    vscode.commands.registerCommand('jetbrains-titlebar.applyGlow', async () => {
      await hacker.apply();
    }),
    vscode.commands.registerCommand('jetbrains-titlebar.removeGlow', async () => {
      await hacker.none();
    }),
  ].filter((v) => v !== undefined);
  context.subscriptions.push(...commands);
};
