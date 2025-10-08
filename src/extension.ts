import { ExtensionContext, workspace } from 'vscode';
import { injectMarker } from '@/core/marker.js';
import registers from '@/registers.js';

export const activate = async (context: ExtensionContext) => {
  injectMarker();

  context.subscriptions.push(workspace.onDidChangeWorkspaceFolders(injectMarker));

  // Register commands
  registers(context);
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const deactivate = () => {};
