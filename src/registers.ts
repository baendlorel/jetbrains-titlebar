import { commands, ExtensionContext, Disposable } from 'vscode';
import hacker from '@/core/hacker.js';

export default (context: ExtensionContext) => {
  const list: Disposable[] = [
    commands.registerCommand('jetbrains-titlebar.applyGlow', async () => {
      await hacker.apply();
    }),
    commands.registerCommand('jetbrains-titlebar.removeGlow', async () => {
      await hacker.none();
    }),
    commands.registerCommand('jetbrains-titlebar.relocateCssPath', async () => {
      await hacker.relocate();
    }),
  ].filter((v) => v !== undefined);

  context.subscriptions.push(...list);
};
