import vscode from 'vscode';

import { Commands } from '@/common/consts';
import controlPanel from '@/control-panel';

export default (context: vscode.ExtensionContext) => {
  const commands: vscode.Disposable[] = [
    vscode.commands.registerCommand(Commands.ControlPanel, controlPanel.bind(context)),
  ].filter((v) => v !== undefined);
  context.subscriptions.push(...commands);
};
