import { commands, ExtensionContext, Disposable } from 'vscode';
import hacker from '@/core/hacker.js';

export default (context: ExtensionContext) => {
  const reg = commands.registerCommand;
  const list: Disposable[] = [
    reg('jetbrains-titlebar.applyGlow', () => hacker.apply()),
    reg('jetbrains-titlebar.removeGlow', () => hacker.remove()),
    reg('jetbrains-titlebar.manuallyRelocateCssPath', () => hacker.manuallyRelocate()),
    reg('jetbrains-titlebar.autoRelocateCssPath', () => hacker.autoRelocate(false)),
  ].filter((v) => v !== undefined);

  context.subscriptions.push(...list);
};
