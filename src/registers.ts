import vscode from 'vscode';

export default (context: vscode.ExtensionContext) => {
  const commands: vscode.Disposable[] = [].filter((v) => v !== undefined);
  context.subscriptions.push(...commands);
};
