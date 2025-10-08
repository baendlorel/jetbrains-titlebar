import vscode from 'vscode';
import { injectMarker } from '@/core/marker.js';
import registers from '@/registers.js';

export const activate = async (context: vscode.ExtensionContext) => {
  injectMarker();

  context.subscriptions.push(vscode.workspace.onDidChangeWorkspaceFolders(injectMarker));

  // Register commands
  registers(context);
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const deactivate = () => {};
